import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ title, description }) => (
  <div className="flex flex-col justify-center h-64 w-64 shadow-xl rounded-lg text-center py-3 px-5">
    <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
    <p className="text-l text-gray-700">{description}</p>
  </div>
);

Card.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
};

Card.defaultProps = {
  title: '',
  description: '',
};

export default Card;
