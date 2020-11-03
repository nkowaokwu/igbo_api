import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { map } from 'lodash';
import { useForm } from 'react-hook-form';
import Pagination from '@material-ui/lab/Pagination';
import { WORDS_API_URL } from '../config';
import Word from '../components/Word';
import Modal from '../components/Modal';
import AddWord from '../forms/AddWord';

const Home = () => {
  const { reset } = useForm();
  const [input, setInput] = useState('');
  const [visible, setVisible] = useState(false);
  const [lastSearch, setLastSearch] = useState(input);
  const [response, setResponse] = useState([]);
  const [noMatch, setNoMatch] = useState('');
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    reset();
    setVisible(false);
  };

  /* Returns the correct number of pages of words */
  const determinePageCount = (res) => {
    const WORDS_PER_PAGE = 10;
    const wordCount = Math.floor(parseInt(res.headers['content-range'], 10));
    return wordCount % WORDS_PER_PAGE === 0 ? (wordCount / WORDS_PER_PAGE) - 1 : wordCount / WORDS_PER_PAGE;
  };

  /* Makes a network request and updates the number of pages */
  const searchWord = async (page = 0) => {
    const res = await axios.get(`${WORDS_API_URL}?keyword=${lastSearch}&page=${page}`);
    const pages = determinePageCount(res);
    setPageCount(pages);
    setResponse(res.data);
    setNoMatch(`No word matching ${input}`);
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
      <div className="flex flex-col items-center w-11/12 lg:w-8/12">
        {process.env.NODE_ENV !== 'production' ? (
          <button
            type="button"
            onClick={showModal}
            data-test="add-button"
          >
            add word
          </button>
        ) : null}
        <h1 className="self-start lg:self-center text-2xl lg:text-4xl my-3 mx-2 lg:mx-12">Igbo Dictionary</h1>
        <form onSubmit={handleSearch} className="flex flex-col lg:flex-row w-full lg:justify-between lg:items-center">
          <input
            data-test="search-bar"
            className="bg-gray-300 rounded-full h-12 py-3 px-3 w-full lg:w-9/12"
            placeholder="Search in Igbo or English"
            onInput={(e) => setInput(e.target.value)}
            value={input}
          />
          <button
            className="w-full text-gray-100 bg-green-800 py-3 mt-5 lg:mt-0 rounded lg:w-2/12"
            type="submit"
          >
            Search
          </button>
        </form>
        {
          response.length > 0
            ? map(response, (word, idx) => <Word word={word} key={idx} />)
            : noMatch
        }
      </div>
      <Modal
          title="Suggest a New Word"
          isOpen={visible}
          onRequestClose={handleCancel}
          className={`bg-white border-current border-solid border border-gray-200
          max-h-full h-8/12 w-full lg:w-10/12 p-12 rounded-lg shadow-lg
          overflow-scroll text-gray-800`}
      >
        <AddWord />
      </Modal>
      {pageCount > 0 ? (
        <div className="py-10">
          <Pagination
            data-test="pagination"
            count={pageCount}
            onChange={(_, page) => handlePagination(page)}
            shape="rounded"
          />
        </div>
      ) : null}
    </div>
  );
};

export default Home;
