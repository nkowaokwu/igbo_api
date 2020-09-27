import { keys } from 'lodash';
import removePrefix from '../shared/utils/removePrefix';
import dictionary from '../ig/dictionaries/ig-en_expanded.json';

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