import { keys } from 'lodash';
import removePrefix from '../shared/utils/removePrefix';
import databaseDictionary from '../ig/dictionaries/ig-en_expanded.json';
import mockedData from '../tests/__mocks__/data.mock.json';

const dictionary = process.env.NODE_ENV === 'test' ? mockedData : databaseDictionary;
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