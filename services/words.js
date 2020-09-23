import dictionary from '../ig/dictionaries/ig-en_expanded.json';

const findSearchWord = (word) => {
    const result = dictionary[word];
    return result;
}

export {
    findSearchWord,
}