import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { navigate } from 'gatsby';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Modal from './Modal';
import AddWord from '../forms/AddWord';
import SearchIcon from '../assets/icons/search.svg';

const SearchBar = ({
  setDefaultValues,
  setRoute,
  defaultWord,
  defaultPage,
}) => {
  const [input, setInput] = useState(defaultWord || '');
  const [lastSearch, setLastSearch] = useState(input);
  const [visible, setVisible] = useState(false);
  const matchesLargeScreenQuery = useMediaQuery('(min-width:1024px)');

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  /* Navigates to the search route to make network request */
  const navigateToSearch = async (page = defaultPage) => {
    setRoute(`/search?word=${lastSearch}&page=${page}`);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLastSearch(input);
  };

  useEffect(() => {
    if (lastSearch !== '') {
      navigateToSearch();
    }
  }, [lastSearch]);

  return (
    <>
      <div className="flex justify-between space-x-2 lg:space-x-5 responsive-container">
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
            {matchesLargeScreenQuery ? '+ Add Word' : '+'}
          </button>
        ) : null}
      </div>
      <Modal
        title="Suggest a New Word"
        isOpen={visible}
        onRequestClose={handleCancel}
        className="modal-container"
      >
        <AddWord />
      </Modal>
    </>
  );
};

SearchBar.propTypes = {
  setDefaultValues: PropTypes.func,
  setRoute: PropTypes.func,
  defaultWord: PropTypes.string,
  defaultPage: PropTypes.number,
};

SearchBar.defaultProps = {
  setDefaultValues: () => {},
  setRoute: navigate,
  defaultWord: '',
  defaultPage: 0,
};

export default SearchBar;
