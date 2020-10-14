import stringSimilarity from 'string-similarity';
import createRegExp from '../../shared/utils/createRegExp';

/* Either creates a regex pattern for provided searchWord
or fallbacks to matching every word */
export const createQueryRegex = (searchWord) => (!searchWord ? /./ : createRegExp(searchWord));

/* Sorts all the docs based on the provided searchWord */
export const sortDocsByDefinitions = (searchWord, docs) => {
  docs.sort((prevWord, nextWord) => {
    const prevDocDifference = stringSimilarity.compareTwoStrings(searchWord, prevWord.definitions[0] || '') * -100;
    const nextDocDifference = stringSimilarity.compareTwoStrings(searchWord, nextWord.definitions[0] || '') * -100;
    return prevDocDifference - nextDocDifference;
  });
  return docs;
};
