import createRegExp from '../../shared/utils/createRegExp';

const fullTextSearchQuery = ({ keyword, isUsingMainKey, filteringParams }) => (isUsingMainKey && !keyword
  ? { word: { $regex: /./ }, ...filteringParams }
  : { $text: { $search: keyword }, ...filteringParams }
);

const definitionsQuery = ({ regex, filteringParams }) => ({
  definitions: { $in: [regex] },
  ...filteringParams,
});

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
  'attributes.isStandardIgbo': true,
});
export const searchForAllWordsWithNsibidi = () => ({
  nsibidi: { $ne: '' },
});

export const searchForAllDevelopers = () => ({
  name: { $ne: '' },
});
