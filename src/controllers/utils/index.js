import levenshtein from 'js-levenshtein';
import createRegExp from '../../shared/utils/createRegExp';

/* Either creates a regex pattern for provided searchWord
or fallbacks to matching every word */
export const createQueryRegex = (searchWord) => (!searchWord ? /./ : createRegExp(searchWord));

/* Sorts all the docs based on the provided searchWord */
export const sortDocsByDefinitions = (searchWord, docs) => {
  docs.sort((prevWord, nextWord) => {
    const prevDocDifference = levenshtein(searchWord, prevWord.definitions[0] || '') - 1;
    const nextDocDifference = levenshtein(searchWord, nextWord.definitions[0] || '') - 1;
    return prevDocDifference - nextDocDifference;
  });
  return docs;
};
