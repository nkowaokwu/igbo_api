import React from 'react';
import { ExamplePropTypes } from '../utils/PropTypeShapes';

const Example = ({ example }) => (
  <div>
    <h3 className="text-gray-900 lg:truncate">{example.igbo}</h3>
    <h3 className="text-gray-500 lg:truncate">{example.english}</h3>
  </div>
);

Example.propTypes = {
  example: ExamplePropTypes,
};

Example.defaultProps = {
  example: {},
};

export default Example;
