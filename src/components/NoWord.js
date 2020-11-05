import React from 'react';
import PropTypes from 'prop-types';

const NoWord = ({ word, showAddWordModal, setDefaultValues }) => (
  <div className="flex flex-col text-center items-center space-y-5 py-5">
    <h1 className="text-2xl text-gray-800 font-bold">{`Sorry, we don't have ${word}`}</h1>
    {process.env.NODE_ENV !== 'production' ? (
      <>
        <h2 className="text-xl text-gray-800">Think this word should be included?</h2>
        <h2 className="text-xl text-gray-800">Define it!</h2>
        <button
          type="button"
          data-test="define-word-button"
          className="transition-all duration-200 bg-green-700 hover:bg-green-600 text-white px-10 py-3 rounded-md"
          onClick={() => {
            setDefaultValues({ word });
            showAddWordModal();
          }}
        >
          {`Define ${word}`}
        </button>
      </>
    ) : null}
  </div>
);

NoWord.propTypes = {
  word: PropTypes.string.isRequired,
  showAddWordModal: PropTypes.func,
  setDefaultValues: PropTypes.func,
};

NoWord.defaultProps = {
  showAddWordModal: () => {},
  setDefaultValues: () => {},
};

export default NoWord;
