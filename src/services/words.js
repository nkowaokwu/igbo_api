import reduce from 'lodash/reduce';
import keys from 'lodash/keys';
import removePrefix from '../shared/utils/removePrefix';
import databaseDictionary from '../dictionaries/ig-en/ig-en_expanded.json';

const doesVariationMatch = (termInformation, regexWord) => (
  reduce(termInformation, (status, information) => {
    if (status) {
      return status;
    }
    return (information.variations || []).some((variation) => variation.match(regexWord));
  }, false)
);

/* Provided a dictionary, find the corresponding terms */
export const resultsFromDictionarySearch = (regexWord, word, dictionary) => (
  keys(dictionary).reduce((matchedResults, key) => {
    const currentMatchedResults = { ...matchedResults };
    const termInformation = dictionary[key];
    const trimmedKey = removePrefix(key);
    const isTrimmedKeyAndWordSameLength = trimmedKey.match(regexWord);
    if (isTrimmedKeyAndWordSameLength || doesVariationMatch(termInformation, regexWord)) {
      currentMatchedResults[key] = termInformation;
    }
    return currentMatchedResults;
  }, {})
);

export const findSearchWord = (...args) => resultsFromDictionarySearch(...args, databaseDictionary);
