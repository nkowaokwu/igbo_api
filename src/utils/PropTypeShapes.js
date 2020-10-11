import PropTypes from 'prop-types';

const WordPropTypes = PropTypes.shape({
  word: PropTypes.string,
  wordClass: PropTypes.string,
  definitions: PropTypes.arrayOf(PropTypes.string),
  phrases: PropTypes.arrayOf(PropTypes.string),
  examples: PropTypes.arrayOf(PropTypes.string),
  variations: PropTypes.arrayOf(PropTypes.string),
});

const PhrasePropTypes = PropTypes.shape({
  phrase: PropTypes.string,
  parentWord: PropTypes.string,
  definitions: PropTypes.arrayOf(PropTypes.string),
  examples: PropTypes.arrayOf(PropTypes.string),
});

const ExamplePropTypes = PropTypes.shape({
  example: PropTypes.string,
  parentWord: PropTypes.string,
  parentPhrase: PropTypes.string,
});

export {
  WordPropTypes,
  PhrasePropTypes,
  ExamplePropTypes,
};
