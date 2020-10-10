import React from 'react';
import PropTypes from 'prop-types';

const Phrase = ({ phrase }) => (
  <div>
    <h3>{phrase.phrase}</h3>
    <h3 className="text-gray-500 truncate ">{phrase.definitions[0]}</h3>
  </div>
);

Phrase.propTypes = {
  phrase: PropTypes.object,
};

Phrase.defaultProps = {
  phrase: {},
};

export default Phrase;
