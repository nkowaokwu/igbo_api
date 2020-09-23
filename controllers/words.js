import { findSearchWord } from '../services/words';

const getWordData = (_, res) => {
    const { req: { query }} = res;
    const searchWord = query.keyword;
    if (!searchWord) {
        throw new Error('Did not provide term');
    }
    return res.send(findSearchWord(searchWord));
}

export {
    getWordData,
};