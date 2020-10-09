import React from 'react';
import PropTypes from 'prop-types';

const Example = ({ example }) => (
  <div>
    <h3 className="text-gray-500">{example.example}</h3>
  </div>
);

Example.propTypes = {
  example: PropTypes.object,
};

Example.defaultProps = {
  example: {},
};

export default Example;
