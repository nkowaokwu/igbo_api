import createRegExp from '../../shared/utils/createRegExp';

const fullTextSearchQuery = (keyword, isUsingMainKey) => (isUsingMainKey && !keyword
  ? { word: { $regex: /./ } }
  : { $text: { $search: keyword } }
);

/* Searching for words that match the keyword and also the wordClass */
export const searchIgboTextWithWordClass = ({ searchWord, wordClass, isUsingMainKey }) => (isUsingMainKey && !searchWord
  ? { $and: [{ word: { $regex: /./ } }, { wordClass }] }
  : { $and: [{ $text: { $search: searchWord } }, { wordClass }] }
);
const definitionsQuery = (regex) => ({ definitions: { $in: [regex] } });

/* Regex match query used to later to defined the Content-Range response header */
export const searchExamplesRegexQuery = (regex) => ({ $or: [{ igbo: regex }, { english: regex }] });
export const searchIgboTextSearch = fullTextSearchQuery;
/* Since the word field is not non-accented yet,
 * a strict regex search for words has to be used as a workaround */
export const strictSearchIgboQuery = (word) => ({
  word: createRegExp(word, true),
});
export const searchEnglishRegexQuery = definitionsQuery;

export const searchForAllWordsWithAudioPronunciations = () => ({
  pronunciation: { $exists: true },
  $expr: { $gt: [{ $strLenCP: '$pronunciation' }, 10] },
});
export const searchForAllWordsWithIsStandardIgbo = () => ({
  isStandardIgbo: true,
});
