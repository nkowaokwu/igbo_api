import React, { useState, useEffect } from 'react';
import { map } from 'lodash';
import Pagination from '@material-ui/lab/Pagination';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import NoWord from '../components/NoWord';
import Word from '../components/Word';
import Modal from '../components/Modal';
import AddWord from '../forms/AddWord';
import getWord from '../API';
import parseQueries from '../utils/parseQueries';

const search = ({ location, navigate }) => {
  const [queries, setQueries] = useState(location?.search ? parseQueries(location.search) : {});
  const [response, setResponse] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [defaultValues, setDefaultValues] = useState({});
  const [visible, setVisible] = useState(false);
  const [route, setRoute] = useState(null);
  const [totalWordCount, setTotalWordCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

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
    setTotalWordCount(wordCount);
    return wordCount % WORDS_PER_PAGE === 0
      ? Math.ceil(wordCount / WORDS_PER_PAGE) - 1
      : Math.ceil(wordCount / WORDS_PER_PAGE);
  };

  /* Paginates to a different page for the same word
   * Shows relevant text in search bar
   * Set the current page to allow for scrolling back to the top of page
   */
  const handlePagination = async (page) => {
    const searchWordRoute = `/search?word=${queries.word}&page=${page}`;
    navigate(searchWordRoute, { state: 'ij' });
    setRoute(searchWordRoute);
  };

  /* Parses the route that generated and handed from SearchBar */
  useEffect(() => {
    if (route) {
      navigate(route);
      setQueries(parseQueries(route.replace('/search', '')));
    }
  }, [route]);

  /* Once the route is parsed, we will use it to make a request for words */
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const res = await getWord(queries.word, queries.page);
      setIsLoading(false);
      const { data: words } = res;
      if (words.length) {
        setResponse(words);
        const pages = determinePageCount(res);
        setPageCount(pages);
      } else {
        setResponse({ word: queries.word });
        setPageCount(0);
      }
    })();
  }, [queries]);

  /* Scrolls to the top of the page after page loads from a pagination request */
  useEffect(() => {
    if (!isLoading) {
      window.scrollTo(0, 0);
    }
  }, [isLoading]);

  return (
    <div className="page-container">
      <Navbar />
      <SearchBar setRoute={setRoute} defaultValue={queries.word} />
      <div className="responsive-container w-10/12">
        {
          response?.length > 0
            ? (
              <>
                <h1 className="text-2xl mt-5">
                  {'Words - '}
                  <span className="text-gray-600">
                    {`${totalWordCount} found`}
                  </span>
                </h1>
                {map(response, (word, idx) => <Word word={word} key={idx} />)}
              </>
            )
            : response instanceof Object && !isLoading ? (
              <NoWord
                word={queries.word}
                showAddWordModal={showModal}
                setDefaultValues={(value) => setDefaultValues(value)}
              />
            ) : null
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

export default search;
