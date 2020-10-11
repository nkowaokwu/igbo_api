import React from 'react';
import { ExamplePropTypes } from '../utils/PropTypeShapes';

const Example = ({ example }) => (
  <div>
    <h3 className="text-gray-500 truncate">{example.example}</h3>
  </div>
);

Example.propTypes = {
  example: ExamplePropTypes,
};

Example.defaultProps = {
  example: {},
};

export default Example;
