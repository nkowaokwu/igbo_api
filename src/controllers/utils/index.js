import levenshtein from 'js-levenshtein';
import createRegExp from '../../shared/utils/createRegExp';

/* Either creates a regex pattern for provided searchWord
or fallbacks to matching every word */
export const createQueryRegex = (searchWord) => (!searchWord ? /./ : createRegExp(searchWord));

/* Sorts all the words based on the provided searchWord */
export const sortDocsByDefinitions = (searchWord, words) => {
  words.sort((prevWord, nextWord) => {
    const prevWordDifference = levenshtein(searchWord, prevWord.definitions[0] || '') - 1;
    const nextWordDifference = levenshtein(searchWord, nextWord.definitions[0] || '') - 1;
    return prevWordDifference - nextWordDifference;
  });
  return words;
};
