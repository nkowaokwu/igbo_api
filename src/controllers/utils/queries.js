import createRegExp from '../../shared/utils/createRegExp';

const fullTextSearchQuery = ({ keyword, isUsingMainKey, requiredAttributes }) => (isUsingMainKey && !keyword
  ? { word: { $regex: /./ }, ...requiredAttributes }
  : { $text: { $search: keyword }, ...requiredAttributes }
);

const definitionsQuery = ({ regex, requiredAttributes }) => ({
  definitions: { $in: [regex] },
  ...requiredAttributes,
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
  isStandardIgbo: true,
});
export const searchForAllWordsWithNsibidi = () => ({
  nsibidi: { $ne: '' },
});
