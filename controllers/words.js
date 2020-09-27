import { findSearchWord } from '../services/words';
import { NO_PROVIDED_TERM } from '../utils/constants/errorMessages';
import diacriticCodes from '../shared/diacriticCodes';

const getWordData = (_, res) => {
    const { req: { query }} = res;
    const searchWord = query.keyword;
    if (!searchWord) {
        res.status(400);
        throw new Error(NO_PROVIDED_TERM);
    }
    const regexWordString = [...searchWord].reduce((regexWord, letter) => {
        return `${regexWord}${diacriticCodes[letter] || letter}`
    }, '');
    const regexWord = new RegExp(regexWordString);
    return res.send(findSearchWord(regexWord, searchWord));
}

export { getWordData };