import { reduce, keys } from 'lodash';
import removePrefix from '../shared/utils/removePrefix';
import databaseDictionary from '../dictionaries/ig-en/ig-en_expanded.json';

const doesVariationMatch = (termInformation, regexWord) => {
    return reduce(termInformation, (status, information) => {
        if (status) { return status; }
        return information.variations.some((variation) => variation.match(regexWord));
    }, false);
};

/* Provided a dictionary, find the corresponding terms */
export const resultsFromDictionarySearch = (regexWord, word, dictionary) => {
    return keys(dictionary).reduce((matchedResults, key) => {
        const termInformation = dictionary[key];
        const trimmedKey = removePrefix(key);
        if ((trimmedKey.match(regexWord) && trimmedKey.length === word.length) || doesVariationMatch(termInformation, regexWord)) {
            matchedResults[key] = termInformation;
        }
        return matchedResults;
    }, {});
};

export const findSearchWord = (...args) => (
    resultsFromDictionarySearch(...args, databaseDictionary)
);