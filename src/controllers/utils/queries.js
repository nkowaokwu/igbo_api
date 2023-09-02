import { compact, flatten } from 'lodash';
import { cjkRange } from '../../shared/constants/diacriticCodes';
import WordClass from '../../shared/constants/WordClass';
import Tenses from '../../shared/constants/Tenses';
import StopWords from '../../shared/constants/StopWords';

const generateMultipleNsibidi = (keywords) => keywords.map(({ text }) => ({ 'definitions.nsibidi': text }));

const generateMultipleWordRegex = (keywords) =>
  keywords.map(({ regex }) => ({ word: { $regex: regex.wordReg.source, $options: 'i' } }));

const generateMultipleDefinitionsRegex = (keywords) => ({
  'definitions.definitions': { $in: compact(keywords.map(({ regex }) => regex.definitionsReg)) },
});

const generateMultipleVariationsRegex = (keywords) =>
  keywords.map(({ regex }) => ({ variations: { $in: [regex.wordReg.source] } }));

const generateMultipleDialectsWordRegex = (keywords) =>
  keywords.map(({ regex }) => ({ 'dialects.word': { $regex: regex.wordReg.source, $options: 'i' } }));

const generateMultipleTensesWordRegex = (keywords) =>
  flatten(
    Object.values(Tenses).reduce((finalRegexes, { value }) => {
      const regexes = keywords.map(({ regex }) => ({
        [`tenses.${value}`]: { $regex: regex.wordReg.source, $options: 'i' },
      }));
      finalRegexes.push(regexes);
      return finalRegexes;
    }, [])
  );
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
              ...generateMultipleWordRegex(keywords),
              ...generateMultipleVariationsRegex(keywords),
              ...generateMultipleDialectsWordRegex(keywords),
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
