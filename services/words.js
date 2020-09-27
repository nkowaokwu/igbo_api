import { keys } from 'lodash';
import dictionary from '../ig/dictionaries/ig-en_expanded.json';

/* Removes the verb prefix character '-' */
const removePrefix = (term) => {
    if (term.charAt(0) === '-') {
        return term.substring(1);
    }
    return term;
}

export const findSearchWord = (regexWord, word) => {
    const results = keys(dictionary).reduce((matchedResults, key) => {
        const termInformation = dictionary[key];
        const trimmedKey = removePrefix(key);
        if (trimmedKey.match(regexWord) && trimmedKey.length === word.length) {
            matchedResults[key] = termInformation;
        }
        return matchedResults;
    }, {});
    return results;
}