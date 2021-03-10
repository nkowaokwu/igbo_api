import createRegExp from '../../shared/utils/createRegExp';

const fullTextSearchQuery = (keyword, isUsingMainKey) => (isUsingMainKey && !keyword
  ? { word: { $regex: /./ } }
  : { $text: { $search: keyword } }
);
const definitionsQuery = (regex) => ({ definitions: { $in: [regex] } });
const hostsQuery = (host) => ({ hosts: { $in: [host] } });

/* Regex match query used to later to defined the Content-Range response header */
export const searchExamplesRegexQuery = (regex) => ({ $or: [{ igbo: regex }, { english: regex }] });
export const searchIgboTextSearch = fullTextSearchQuery;
/* Since the word field is not non-accented yet,
 * a strict regex search for words has to be used as a workaround */
export const strictSearchIgboQuery = (word) => ({
  word: createRegExp(word, true),
});
export const searchEnglishRegexQuery = definitionsQuery;
export const searchDeveloperWithHostsQuery = hostsQuery;
