import removePrefix from '../shared/utils/removePrefix';
import { findSearchWord } from '../services/words';
import { NO_PROVIDED_TERM } from '../utils/constants/errorMessages';
import diacriticCodes from '../shared/constants/diacriticCodes';

export const createRegExpAndSearch = (searchWord) => {
    const regexWordString = [...searchWord].reduce((regexWord, letter) => {
        return `${regexWord}${diacriticCodes[letter] || letter}`
    }, '');
    const regexWord = new RegExp(regexWordString);
    return findSearchWord(regexWord, searchWord);
}

const getWordData = (_, res) => {
    const { req: { query }} = res;
    const searchWord = removePrefix(query.keyword);
    if (!searchWord) {
        res.status(400);
        throw new Error(NO_PROVIDED_TERM);
    }
    return res.send(createRegExpAndSearch(searchWord));
}

export { getWordData };