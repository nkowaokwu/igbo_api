import compact from 'lodash/compact';
import WordClass from '../../shared/constants/WordClass';
import Tenses from '../../shared/constants/Tenses';

const fullTextSearchQuery = ({
  keywords,
  isUsingMainKey,
  filteringParams,
}) => (isUsingMainKey && !keywords?.length
  ? { word: { $regex: /./ }, ...filteringParams }
  : (!isUsingMainKey && !keywords?.length)
    ? { _id: { $exists: false }, id: { $exists: false } }
    : {
      $or: keywords.map(({ text, regex, wordClass = [] }) => ({
        $and: [{
          $or: compact([
            { word: text },
            { word: { $regex: regex.wordReg } },
            (regex.definitionsReg ? { 'definitions.definitions': { $regex: regex.definitionsReg } } : null),
            { variations: regex.wordReg },
            { 'definitions.nsibidi': text },
            { 'dialects.word': regex.wordReg },
            ...Object.values(Tenses).map(({ value }) => ({ [`tenses.${value}`]: regex.wordReg })),
          ]),
          ...(wordClass?.length ? { 'definitions.wordClass': { $in: wordClass } } : {}),
        }],
      })),
      ...filteringParams,
    }
);

const definitionsQuery = ({ regex, filteringParams }) => ({
  'definitions.definitions': { $in: [regex.definitionsReg] },
  ...filteringParams,
});

/* Regex match query used to later to defined the Content-Range response header */
export const searchExamplesRegexQuery = (regex) => (
  { $or: [{ igbo: regex.wordReg }, { english: regex.definitionsReg }] }
);
export const searchIgboTextSearch = fullTextSearchQuery;
/* Since the word field is not non-accented yet,
 * a strict regex search for words has to be used as a workaround */
export const strictSearchIgboQuery = (keywords) => ({
  $or: keywords.map(({ regex }) => ({ word: { $regex: regex.wordReg } })),
});
export const searchEnglishRegexQuery = definitionsQuery;
export const searchForAllDevelopers = () => ({
  name: { $ne: '' },
});
export const searchForAllVerbsAndSuffixesQuery = () => ({
  'definitions.wordClass': {
    $in: [
      WordClass.AV.value,
      WordClass.MV.value,
      WordClass.PV.value,
      WordClass.ISUF.value,
      WordClass.ESUF.value,
    ],
  },
});
