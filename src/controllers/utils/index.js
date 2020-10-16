import stringSimilarity from 'string-similarity';
import createRegExp from '../../shared/utils/createRegExp';

const RESPONSE_LIMIT = 10;

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

/* Wrapper function to prep response by limiting number of docs return to the client */
export const paginate = (res, docs, page) => {
  res.setHeader('Content-Range', docs.length);
  return res.send(docs.slice(page * RESPONSE_LIMIT, RESPONSE_LIMIT * (page + 1)));
};

export const convertRangeToPage = (range = '[0,10]') => {
  try {
    return parseInt(range.substring(range.indexOf('[') + 1, range.indexOf(',')), 10) / 10;
  } catch {
    return 0;
  }
};
