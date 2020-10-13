import PropTypes from 'prop-types';

const WordPropTypes = PropTypes.shape({
  word: PropTypes.string,
  wordClass: PropTypes.string,
  definitions: PropTypes.arrayOf(PropTypes.string),
  stems: PropTypes.arrayOf(PropTypes.string),
  examples: PropTypes.arrayOf(PropTypes.string),
  variations: PropTypes.arrayOf(PropTypes.string),
});

const ExamplePropTypes = PropTypes.shape({
  igbo: PropTypes.string,
  english: PropTypes.string,
  associatedWords: PropTypes.arrayOf(PropTypes.string),
});

export {
  WordPropTypes,
  ExamplePropTypes,
};
