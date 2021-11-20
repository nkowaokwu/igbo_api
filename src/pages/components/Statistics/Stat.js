import React from 'react';
import PropTypes from 'prop-types';

const Stat = ({ value, header, children }) => (
  <div
    className="flex flex-col justify-center items-center h-auto
    text-gray-700 text-center custom-border bg-gray-400 px-4 py-4 m-8"
  >
    <h1 className="text-6xl">{`${value}+`}</h1>
    <p>{header}</p>
    {children}
  </div>
);

Stat.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  header: PropTypes.string.isRequired,
  children: PropTypes.shape({}),
};

Stat.defaultProps = {
  children: [],
};

export default Stat;
