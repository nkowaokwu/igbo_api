import compact from 'lodash/compact';
import { cjkRange } from '../../shared/constants/diacriticCodes';
import WordClass from '../../shared/constants/WordClass';
import Tenses from '../../shared/constants/Tenses';
import StopWords from '../../shared/constants/StopWords';
import { Keyword } from './types';
import createRegExp, { SearchRegExp } from '../../shared/utils/createRegExp';
import { Filters } from '../types';

type Keywords = Keyword[];
const generateMultipleNsibidi = (keywords: Keywords) => keywords.map(({ text }) => ({ 'definitions.nsibidi': text }));

const generateMultipleWordRegex = (keywords: Keywords) =>
  keywords.map(({ regex }) => ({ word: { $regex: regex.wordReg.source, $options: 'i' } }));

const generateMultipleDefinitionsRegex = (keywords: Keywords) => ({
  'definitions.definitions': { $in: compact(keywords.map(({ regex }) => regex?.definitionsReg)) },
});

const generateMultipleVariationsRegex = (keywords: Keywords) => {
  const { regex } = keywords[0];
  return { variations: { $in: [regex.wordReg.source] } };
};

const generateMultipleDialectsWordRegex = (keywords: Keywords) => {
  const { regex } = keywords[0];
  return { 'dialects.word': { $regex: regex.wordReg.source, $options: 'i' } };
};

const generateMultipleTensesWordRegex = (keywords: Keywords) => {
  const tenses = Object.values(Tenses).map(({ value }) => {
    const { regex } = keywords[0];
    return { [`tenses.${value}`]: { $regex: regex.wordReg.source, $options: 'i' } };
  });
  return tenses;
};

const fullTextSearchQuery = ({
  keywords,
  isUsingMainKey,
  filters = {},
}: {
  keywords: Keywords;
  isUsingMainKey: boolean | undefined;
  filters: Filters;
}) => {
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
              generateMultipleVariationsRegex(keywords),
              generateMultipleDialectsWordRegex(keywords),
              ...generateMultipleTensesWordRegex(keywords),
            ]),
          },
        ],
        ...filters,
      };
};
const fullTextDefinitionsSearchQuery = ({
  keywords,
  isUsingMainKey,
  searchWord = '',
  filters,
}: {
  keywords: Keywords;
  isUsingMainKey: boolean | undefined;
  filters: Filters;
  searchWord: string;
}) =>
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

const definitionsQuery = ({
  regex,
  searchWord = '',
  filters,
}: {
  regex: SearchRegExp;
  searchWord: string;
  filters: Filters;
}) => ({
  $and: [
    filters,
    StopWords.includes(searchWord.toLowerCase()) ? {} : { $text: { $search: searchWord } },
    { 'definitions.definitions': { $in: [regex.definitionsReg] } },
  ],
});

/* Regex match query used to later to defined the Content-Range response header */
export const searchExamplesRegexQuery = ({ regex, flags }: { regex: SearchRegExp; flags: { style: string } }) => ({
  $or: [{ igbo: regex.wordReg }, { english: regex?.definitionsReg }],
  ...(flags.style ? { style: flags.style } : {}),
});
export const searchIgboTextSearch = fullTextSearchQuery;
export const searchDefinitionsWithinIgboTextSearch = fullTextDefinitionsSearchQuery;
/* Since the word field is not non-accented yet,
 * a strict regex search for words has to be used as a workaround */
export const strictSearchIgboQuery = (keywords: Keywords) => ({
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
export const searchNsibidiCharactersQuery = (keyword: string) => {
  const regex = createRegExp(keyword).wordReg;
  return {
    $or: [{ nsibidi: { $regex: regex } }, { definitions: { $regex: regex } }],
  };
};
