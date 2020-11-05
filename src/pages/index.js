import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { map } from 'lodash';
import Pagination from '@material-ui/lab/Pagination';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { WORDS_API_URL } from '../config';
import Navbar from '../components/Navbar';
import NoWord from '../components/NoWord';
import Word from '../components/Word';
import Modal from '../components/Modal';
import AddWord from '../forms/AddWord';
import SearchIcon from '../assets/icons/search.svg';

const Home = () => {
  const [visible, setVisible] = useState(false);
  const [defaultValues, setDefaultValues] = useState({});
  const [input, setInput] = useState('');
  const [lastSearch, setLastSearch] = useState(input);
  const [response, setResponse] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const matches = useMediaQuery('(min-width:1024px)');

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  /* Returns the correct number of pages of words */
  const determinePageCount = (res) => {
    const WORDS_PER_PAGE = 10;
    const wordCount = parseInt(res.headers['content-range'], 10);
    return wordCount % WORDS_PER_PAGE === 0
      ? Math.ceil(wordCount / WORDS_PER_PAGE) - 1
      : Math.ceil(wordCount / WORDS_PER_PAGE);
  };

  /* Makes a network request and updates the number of pages */
  const searchWord = async (page = 0) => {
    const res = await axios.get(`${WORDS_API_URL}?keyword=${lastSearch}&page=${page}`);
    const pages = determinePageCount(res);
    setPageCount(pages);
    setResponse(res.data);
  };

  /* Paginates to a different page for the same word
   * Shows relevant text in search bar
   * Set the current page to allow for scrolling back to the top of page
   */
  const handlePagination = async (page) => {
    await searchWord(page);
    if (lastSearch !== input) {
      setInput(lastSearch);
    }
    setCurrentPage(page);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLastSearch(input);
  };

  /* Scrolls to the top of the page after paginating */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  useEffect(() => {
    if (lastSearch !== '') {
      searchWord();
    }
  }, [lastSearch]);

  return (
    <div className="flex flex-col items-center">
      <Navbar />
      <div className="responsive-container flex flex-col">
        <div className="flex justify-between space-x-2 lg:space-x-5">
          <form
            onSubmit={handleSearch}
            className="flex flex-col lg:flex-row w-10/12 lg:justify-between lg:items-center"
          >
            <div className="flex w-full items-center bg-gray-300 rounded-lg h-12 py-3 px-3">
              <input
                data-test="search-bar"
                className="bg-gray-300 rounded-full h-12 py-3 px-3 w-11/12 lg:w-full"
                placeholder="Search in Igbo or English"
                onInput={(e) => setInput(e.target.value)}
                value={input}
              />
              <button
                className="lg:mt-0 w-1/12 lg:w-6 rounded"
                data-test="search-button"
                type="submit"
              >
                <SearchIcon />
              </button>
            </div>
          </form>
          {process.env.NODE_ENV !== 'production' ? (
            <button
              type="button"
              onClick={() => {
                setDefaultValues({});
                showModal();
              }}
              data-test="add-button"
              className="transition-all duration-200 w-2/12 h-12 bg-green-700 hover:bg-green-600 rounded-lg text-white"
            >
              {matches ? '+ Add Word' : '+'}
            </button>
          ) : null}
        </div>
        {
          response?.length > 0
            ? map(response, (word, idx) => <Word word={word} key={idx} />)
            : !response || lastSearch === ''
              ? null
              : (
                <NoWord
                    word={lastSearch}
                    showAddWordModal={showModal}
                    setDefaultValues={(value) => setDefaultValues(value)}
                />
              )
        }
      </div>
      <Modal
        title="Suggest a New Word"
        isOpen={visible}
        onRequestClose={handleCancel}
        className="modal-container"
      >
        <AddWord defaultValues={defaultValues} />
      </Modal>
      {pageCount > 0 ? (
        <div className="py-10">
          <Pagination
            data-test="pagination"
            count={pageCount}
            onChange={(_, page) => handlePagination(page - 1)}
            shape="rounded"
          />
        </div>
      ) : null}
    </div>
  );
};

export default Home;
