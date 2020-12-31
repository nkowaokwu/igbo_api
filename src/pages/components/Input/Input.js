import React from 'react';
import PropTypes from 'prop-types';

const Input = ({ header, type, ...rest }) => (
  <div className="flex flex-col items-left w-full my-3">
    <h3 className="text-gray-600 font-normal mb-3">{header}</h3>
    <input
      {...rest}
      className="border-gray-400 border border-solid rounded-md h-10 w-full px-2"
      type={type}
    />
  </div>
);

Input.propTypes = {
  header: PropTypes.string.isRequired,
  type: PropTypes.string,
};

Input.defaultProps = {
  type: '',
};

export default Input;
