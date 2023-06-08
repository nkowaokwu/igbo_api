import stringSimilarity from 'string-similarity';
import get from 'lodash/get';
import Version from '../../shared/constants/Version';
import removeAccents from '../../shared/utils/removeAccents';
import removePrefix from '../../shared/utils/removePrefix';
import { SearchRegExp } from '../../shared/utils/createRegExp';
import Word from '../../models/interfaces/Word';

const MATCHING_DEFINITION_INDEX = 1000;
const MATCHING_DEFINITION_INDEX_FACTOR = 100;
const WORD_LENGTH_FACTOR = 100;
const WORD_LENGTH_DIFFERENCE_FACTOR = 15;
const IS_COMMON = 1000;
const SIMILARITY_FACTOR = 100;
const EXACT_MATCH_FACTOR = 2000;
const SIMILAR_WORD_THRESHOLD = 1.5;
const NO_FACTOR = 0;

const generateSecondaryKey = (version) => (
  version === Version.VERSION_1 ? 'definitions[0]' : 'definitions[0].definitions[0]'
);

/* Sorts all the docs based on the provided searchWord */
export const sortDocsBy = (
  searchWord: string,
  docs: Word[],
  key: string,
  version: Version,
  regex: SearchRegExp,
) => (
  docs.sort((prevDoc, nextDoc) => {
    const normalizedSearchWord = removePrefix(searchWord.normalize('NFC'));
    const prevDocValue = get(prevDoc, key);
    const nextDocValue = get(nextDoc, key);
    const cleanedPrevDocValueWithUnderdots = removeAccents.removeExcluding(prevDocValue).normalize('NFC');
    const cleanedNextDocValueWithUnderdots = removeAccents.removeExcluding(nextDocValue).normalize('NFC');
    const cleanedPrevDocValue = removeAccents.remove(prevDocValue).normalize('NFC');
    const cleanedNextDocValue = removeAccents.remove(nextDocValue).normalize('NFC');
    const prevDocValueLengthDifference = (
      WORD_LENGTH_FACTOR
      - (
        Math.abs(normalizedSearchWord.length - removePrefix(cleanedPrevDocValueWithUnderdots).length)
        * WORD_LENGTH_DIFFERENCE_FACTOR
      )
    );
    const nextDocValueLengthDifference = (
      WORD_LENGTH_FACTOR
      - (
        Math.abs(normalizedSearchWord.length - removePrefix(cleanedNextDocValueWithUnderdots).length)
        * WORD_LENGTH_DIFFERENCE_FACTOR
      )
    );
    const prevSecondaryKeyValue = get(prevDoc, generateSecondaryKey(version)) || '';
    const nextSecondaryKeyValue = get(nextDoc, generateSecondaryKey(version)) || '';
    const rawPrevDefinitionMatchIndex = (prevSecondaryKeyValue as string)?.search?.(regex.hardDefinitionsReg) || -1;
    const rawNextDefinitionMatchIndex = (nextSecondaryKeyValue as string)?.search?.(regex.hardDefinitionsReg) || -1;
    const prevDefinitionMatchIndexValue = rawPrevDefinitionMatchIndex === -1
      ? 11
      : rawPrevDefinitionMatchIndex;
    const nextDefinitionMatchIndexValue = rawNextDefinitionMatchIndex === -1
      ? 11
      : rawNextDefinitionMatchIndex;
    const prevDefinitionMatchIndexFactor = (
      MATCHING_DEFINITION_INDEX - (prevDefinitionMatchIndexValue * MATCHING_DEFINITION_INDEX_FACTOR)
    );
    const nextDefinitionMatchIndexFactor = (
      MATCHING_DEFINITION_INDEX - (nextDefinitionMatchIndexValue * MATCHING_DEFINITION_INDEX_FACTOR)
    );

    const prevDocDifferenceWithUnderdots = stringSimilarity
      .compareTwoStrings(normalizedSearchWord, cleanedPrevDocValueWithUnderdots);
    const nextDocDifferenceWithUnderdots = stringSimilarity
      .compareTwoStrings(normalizedSearchWord, cleanedNextDocValueWithUnderdots);
    const prevDocDifference = stringSimilarity.compareTwoStrings(normalizedSearchWord, cleanedPrevDocValue);
    const nextDocDifference = stringSimilarity.compareTwoStrings(normalizedSearchWord, cleanedNextDocValue);

    const prevDocDifferences = (
      prevDocDifference
      + (prevDocDifference === 1 ? EXACT_MATCH_FACTOR : 0)
      + prevDocDifferenceWithUnderdots
      + (prevDocDifferenceWithUnderdots === 1 ? EXACT_MATCH_FACTOR : 0)
    );
    const nextDocDifferences = (
      nextDocDifference
      + (nextDocDifference === 1 ? EXACT_MATCH_FACTOR : 0)
      + nextDocDifferenceWithUnderdots
      + (nextDocDifferenceWithUnderdots === 1 ? EXACT_MATCH_FACTOR : 0)
    );

    const prevDocSimilarityFactor = (prevDocDifferences >= SIMILAR_WORD_THRESHOLD
      ? prevDocValueLengthDifference : 0) * SIMILARITY_FACTOR + (prevDocDifferences * SIMILARITY_FACTOR);
    const nextDocSimilarityFactor = (nextDocDifferences >= SIMILAR_WORD_THRESHOLD
      ? nextDocValueLengthDifference : 0) * SIMILARITY_FACTOR + (nextDocDifferences * SIMILARITY_FACTOR);

    const prevDocIsCommonFactor = prevDoc?.attributes?.isCommon ? IS_COMMON : 0;
    const nextDocIsCommonFactor = nextDoc?.attributes?.isCommon ? IS_COMMON : 0;

    const finalPrevDocDiff = prevDocSimilarityFactor + prevDocIsCommonFactor + prevDefinitionMatchIndexFactor;
    const finalNextDocDiff = nextDocSimilarityFactor + nextDocIsCommonFactor + nextDefinitionMatchIndexFactor;

    if (finalPrevDocDiff === finalNextDocDiff) {
      return NO_FACTOR;
    }
    return finalPrevDocDiff > finalNextDocDiff ? -1 : 1;
  })
);
