import { LOOK_BACK_DATE } from '../../shared/constants/emailDates';

const wordQuery = (regex) => ({ word: { $regex: regex } });
const variationsQuery = (regex) => ({ variations: { $in: [regex] } });
const definitionsQuery = (regex) => ({ definitions: { $in: [regex] } });

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
  $or: [wordQuery(regex), variationsQuery(regex)],
  merged: null,
});
export const searchPreExistingGenericWordsRegexQuery = (regex) => ({
  $or: [wordQuery(regex), variationsQuery(regex), definitionsQuery(regex)],
  merged: null,
});
export const searchIgboRegexQuery = (regex) => ({
  $or: [wordQuery(regex), variationsQuery(regex)],
});
export const searchEnglishRegexQuery = definitionsQuery;
export const searchForLastWeekQuery = () => ({
  updatedOn: { $gte: LOOK_BACK_DATE.valueOf() },
  merged: { $ne: null },
});
