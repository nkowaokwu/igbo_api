import createRegExp from '../../shared/utils/createRegExp';
import Tenses from '../../shared/constants/Tenses';

const fullTextSearchQuery = ({
  keyword,
  regex,
  isUsingMainKey,
  filteringParams,
}) => (isUsingMainKey && !keyword
  ? { word: { $regex: /./ }, ...filteringParams }
  : (!isUsingMainKey && !keyword)
    ? { $text: { $search: keyword }, ...filteringParams }
    : {
      $or: [
        { word: keyword },
        { word: { $regex: regex.wordReg } },
        { definitions: { $in: [regex.definitionsReg] } },
        { variations: keyword },
        { nsibidi: keyword },
        { [`dialects.${keyword}`]: { $exists: true } },
        ...Object.values(Tenses).reduce((finalIndexes, tense) => ([
          ...finalIndexes,
          { [`tenses.${tense.value}`]: keyword },
        ]), []),
      ],
      ...filteringParams,
    }
);

const definitionsQuery = ({ regex, filteringParams }) => ({
  definitions: { $in: [regex.definitionsReg] },
  ...filteringParams,
});

/* Regex match query used to later to defined the Content-Range response header */
export const searchExamplesRegexQuery = (regex) => (
  { $or: [{ igbo: regex.wordReg }, { english: regex.definitionsReg }] }
);
export const searchIgboTextSearch = fullTextSearchQuery;
/* Since the word field is not non-accented yet,
 * a strict regex search for words has to be used as a workaround */
export const strictSearchIgboQuery = (word) => ({
  word: createRegExp(word, true).wordReg,
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
