/* Regex match query used to later to defined the Content-Range response header */
export const searchExamplesRegexQuery = (regex) => ({ $or: [{ igbo: regex }, { english: regex }] });
export const searchExampleSuggestionsRegexQuery = (regex) => ({
  $or: [{ igbo: regex }, { english: regex }],
  exampleForSuggestion: false,
  merged: null,
});
export const searchPreExistingExampleSuggestionsRegexQuery = ({ igbo, english, associatedWordId }) => ({
  igbo,
  english,
  associatedWords: associatedWordId,
  originalExampleId: null,
  merged: null,
});
export const searchPreExistingWordSuggestionsRegexQuery = (regex) => ({
  $or: [{ word: { $regex: regex } }, { variations: { $in: [regex] } }],
  merged: null,
});
export const searchPreExistingGenericWordsRegexQuery = (regex) => ({
  $or: [{ word: { $regex: regex } }, { variations: { $in: [regex] } }, { definitions: { $in: [regex] } }],
  merged: null,
});
export const searchIgboRegexQuery = (regex) => ({
  $or: [{ word: { $regex: regex } }, { variations: { $in: [regex] } }],
});
export const searchEnglishRegexQuery = (regex) => ({ definitions: { $in: [regex] } });
