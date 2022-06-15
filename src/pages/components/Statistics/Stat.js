import React from 'react';
import PropTypes from 'prop-types';

const numberWithCommas = (x = 0) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const Stat = ({
  value,
  header,
  exact,
  children,
}) => (
  <div
    className="flex flex-col justify-center items-center h-auto
    text-gray-700 text-center px-4 py-4 m-8 rounded-md"
  >
    <h1 className="text-6xl text-gray-700 font-bold">{`${numberWithCommas(value)}${exact ? '' : '+'}`}</h1>
    <h3 className="text-xl text-gray-500">{header}</h3>
    {children}
  </div>
);

Stat.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  header: PropTypes.string.isRequired,
  exact: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.arrayOf(PropTypes.shape({}))]),
};

Stat.defaultProps = {
  children: [],
  exact: true,
};

export default Stat;
