import React from 'react';
// import PropTypes from 'prop-types';

const Statistics = () => (
  <div className="flex bg-gray-200">
    <div className="flex-auto text-gray-700 text-center custom-border bg-gray-400 px-4 py-4 m-8">
      <h1 className="text-6xl">8,000+</h1>
      Words in the database
    </div>
    <div className="flex-auto text-gray-700 text-center custom-border bg-gray-400 px-4 py-2 m-8">
      <h1 className="text-6xl">2,000+</h1>
      Example sentences
    </div>

    <div className="flex text-gray-700 text-center custom-border bg-gray-400 px-4 py-2 m-8">
      <div className="flex-auto text-gray-700 px-4 py-2 m-2">
        <h1 className="text-6xl">750+</h1>
        Audio pronunciations for words
      </div>
      <div className="flex-auto text-gray-700 px-4 py-2 m-2">
        <h1 className="text-6xl">250+</h1>
        Words marked as Central Igbo
      </div>
    </div>
  </div>
);

Statistics.defaultProps = {
  title: '',
  description: '',
};

export default Statistics;
