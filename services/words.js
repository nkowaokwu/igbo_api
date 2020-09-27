import { keys } from 'lodash';
import dictionary from '../ig/dictionaries/ig-en_expanded.json';

const findSearchWord = (regexWord, word) => {
    const results = keys(dictionary).reduce((matchedResults, key) => {
        const termInformation = dictionary[key];
        if (key.match(regexWord) && key.length === word.length) {
            matchedResults[key] = termInformation;
        }
        return matchedResults;
    }, {});
    return results;
}

export {
    findSearchWord,
}