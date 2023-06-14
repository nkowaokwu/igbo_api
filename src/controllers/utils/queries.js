import compact from 'lodash/compact';
import { cjkRange } from '../../shared/constants/diacriticCodes';
import WordClass from '../../shared/constants/WordClass';
import Tenses from '../../shared/constants/Tenses';
import StopWords from '../../shared/constants/StopWords';

const generateMultipleNsibidi = (keywords) => keywords.map(({ text }) => ({ 'definitions.nsibidi': text }));

const generateMultipleWordRegex = (keywords) => {
  const wordRegexes = keywords.reduce((wordRegex, { regex }, index) => {
    if (!index) {
      return regex.wordReg.source;
    }
    return `${wordRegex}|${regex.wordReg.source}`;
  }, '');
  const regex = new RegExp(wordRegexes, 'i');
  return { word: { $regex: regex.source } };
};

const generateMultipleDefinitionsRegex = (keywords) => ({
  'definitions.definitions': { $in: keywords.map(({ regex }) => regex.definitionsReg) },
});

const generateMultipleVariationsRegex = (keywords) => {
  const variationsRegexes = keywords.reduce((wordRegex, { regex }, index) => {
    if (!index) {
      return regex.wordReg.source;
    }
    return `${wordRegex}|${regex.wordReg.source}`;
  }, '');
  const regex = new RegExp(variationsRegexes, 'i');
  return { variations: { $in: [regex] } };
};

const generateMultipleDialectsWordRegex = (keywords) => {
  const dialectsWordRegex = keywords.reduce((wordRegex, { regex }, index) => {
    if (!index) {
      return regex.wordReg.source;
    }
    return `${wordRegex}|${regex.wordReg.source}`;
  }, '');
  const regex = new RegExp(dialectsWordRegex, 'i');
  return { 'dialects.word': { $regex: regex.source } };
};

const generateMultipleTensesWordRegex = (keywords) => {
  const tenses = Object.values(Tenses).map(({ value }) => {
    const tenseRegexes = keywords.reduce((wordRegex, { regex }, index) => {
      if (!index) {
        return regex.wordReg.source;
      }
      return `${wordRegex}|${regex.wordReg.source}`;
    }, '');
    const regex = new RegExp(tenseRegexes, 'i');
    return { [`tenses.${value}`]: { $regex: regex.source } };
  });
  return tenses;
};

const fullTextSearchQuery = ({ keywords, isUsingMainKey, filters = {} }) => {
  const hasNsibidi = keywords.some(({ text }) => text.match(new RegExp(cjkRange)));
  return isUsingMainKey && !keywords?.length
    ? filters
    : !isUsingMainKey && !keywords?.length
    ? { _id: { $exists: false }, id: { $exists: false } }
    : hasNsibidi
    ? { $and: [{ $or: generateMultipleNsibidi(keywords) }, filters] }
    : {
        $and: [
          {
            $or: compact([
              generateMultipleWordRegex(keywords),
              generateMultipleVariationsRegex(keywords),
              generateMultipleDialectsWordRegex(keywords),
              ...generateMultipleTensesWordRegex(keywords),
            ]),
          },
        ],
        ...filters,
      };
};
const fullTextDefinitionsSearchQuery = ({ keywords, isUsingMainKey, searchWord = '', filters }) =>
  !isUsingMainKey && !keywords?.length
    ? { _id: { $exists: false }, id: { $exists: false } }
    : !keywords?.length
    ? filters
    : {
        $and: [
          filters,
          StopWords.includes(searchWord.toLowerCase()) ? {} : { $text: { $search: searchWord } },
          generateMultipleDefinitionsRegex(keywords),
        ],
      };

const definitionsQuery = ({ regex, searchWord = '', filters }) => ({
  $and: [
    filters,
    StopWords.includes(searchWord.toLowerCase()) ? {} : { $text: { $search: searchWord } },
    { 'definitions.definitions': { $in: [regex.definitionsReg] } },
  ],
});

/* Regex match query used to later to defined the Content-Range response header */
export const searchExamplesRegexQuery = (regex) => ({
  $or: [{ igbo: regex.wordReg }, { english: regex.definitionsReg }],
});
export const searchIgboTextSearch = fullTextSearchQuery;
export const searchDefinitionsWithinIgboTextSearch = fullTextDefinitionsSearchQuery;
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
    $in: [WordClass.AV.value, WordClass.PV.value, WordClass.ISUF.value, WordClass.ESUF.value],
  },
});
