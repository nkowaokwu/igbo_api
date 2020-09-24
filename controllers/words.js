import { findSearchWord } from '../services/words';
import { NO_PROVIDED_TERM } from '../utils/constants/errorMessages';

const getWordData = (_, res) => {
    const { req: { query }} = res;
    const searchWord = query.keyword;
    if (!searchWord) {
        res.status(400);
        throw new Error(NO_PROVIDED_TERM);
    }
    return res.send(findSearchWord(searchWord));
}

export {
    getWordData,
};