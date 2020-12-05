import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { ShepherdTour, ShepherdTourContext } from 'react-shepherd';
import { map } from 'lodash';
import Pagination from '@material-ui/lab/Pagination';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import NoWord from '../components/NoWord';
import Word from '../components/Word';
import Modal from '../components/Modal';
import AddWord from '../forms/AddWord';
import { getWord } from '../API';
import parseQueries from '../utils/parseQueries';
import { tourOptions, searchTourSteps } from '../shared/constants/tours';
import LocalStorageKeys from '../shared/constants/LocalStorageKeys';
import CheckLocalStorage from '../utils/CheckLocalStorage';

const Search = ({ location, navigate }) => {
  const [queries, setQueries] = useState(location?.search ? parseQueries(location.search) : {});
  const [response, setResponse] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [defaultValues, setDefaultValues] = useState({});
  const [visible, setVisible] = useState(false);
  const [route, setRoute] = useState(null);
  const [totalWordCount, setTotalWordCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const tour = useContext(ShepherdTourContext);

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
    navigate(searchWordRoute);
    setRoute(searchWordRoute);
  };

  const setDefaultPage = () => {
    const page = parseInt(queries.page, 10);
    return page >= 0 ? page + 1 : page;
  };

  /* Bind handlers to events when the tour is canceled or finished */
  const handleFinishedTour = () => {
    tour.once('cancel', () => localStorage.setItem(LocalStorageKeys.TUTORIAL_GUIDE_COMPLETED, 'true'));
    tour.once('complete', () => localStorage.setItem(LocalStorageKeys.TUTORIAL_GUIDE_COMPLETED, 'true'));
  };

  /* Checks to see if the tour can begin */
  const canStartTour = () => (
    process.env.NODE_ENV !== 'production'
    && tour
    && !tour.isActive()
    && document.querySelector('.word')
    && CheckLocalStorage(LocalStorageKeys.TUTORIAL_GUIDE_COMPLETED)
  );

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
      /* Starts the tour after finding the first word result */
      setTimeout(() => {
        if (canStartTour()) {
          handleFinishedTour();
          tour.start();
        }
      }, 200);
    }
  }, [isLoading]);

  return (
    <div className="page-container">
      <Navbar />
      <SearchBar setRoute={setRoute} defaultWord={queries.word} defaultPage={queries.page} />
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
            defaultPage={setDefaultPage()}
          />
        </div>
      ) : null}
    </div>
  );
};

Search.propTypes = {
  location: Location.isRequired,
  navigate: PropTypes.func.isRequired,
};

export default process.env.NODE_ENV !== 'production' ? (props) => (
  <ShepherdTour steps={searchTourSteps} tourOptions={tourOptions}>
    <Search {...props} />
  </ShepherdTour>
) : Search;
