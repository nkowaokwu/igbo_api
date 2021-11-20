import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ title, description, icon }) => (
  <div
    className={`card-container  card-custom-border flex flex-col justify-center 
    shadow-xl rounded-lg py-3 px-5 my-10 select-none`}
  >
    <span className="rounded-full h-16 w-16 bg-white my-4 justify-center text-center">
      <i className={icon} />
    </span>
    <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
    <p className="text-l text-gray-700">{description}</p>
  </div>
);

Card.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  icon: PropTypes.string,
};

Card.defaultProps = {
  title: '',
  description: '',
  icon: '',
};

export default Card;
