import { keys, reduce, map } from 'lodash';
import removePrefix from '../shared/utils/removePrefix';
import Word from '../models/Word';
import { findSearchWord } from '../services/words';
import { NO_PROVIDED_TERM } from '../utils/constants/errorMessages';
import diacriticCodes from '../shared/constants/diacriticCodes';
import { getDocumentsIds } from '../shared/utils/documentUtils';
import { createPhrase } from './phrases';
import { createExample } from './examples';

export const createRegExp = (searchWord) => {
    const regexWordString = [...searchWord].reduce((regexWord, letter) => {
        return `${regexWord}${diacriticCodes[letter] || letter}`;
    }, '');
    return new RegExp(regexWordString);
};

const getWordData = (_, res) => {
    const { req: { query }} = res;
    const searchWord = removePrefix(query.keyword);
    if (!searchWord) {
        res.status(400);
        res.send(NO_PROVIDED_TERM);
    }
    const regexWord = createRegExp(searchWord);
    return res.send(findSearchWord(regexWord, searchWord));
};

export const createWord = async (data) => {
    const { examples, word, wordClass, definitions } = data;
    const wordData = {
        word,
        wordClass,
        definitions,
    };
    const newWord = new Word(wordData);
    await newWord.save();
    
    /* Go through each word's phrase and create a Phrase document */
    const phrases = keys(data.phrases);
    const savedPhrases = reduce(phrases, (phrasePromises, phrase) => {
        const phraseInfo = data.phrases[phrase];
        phraseInfo.phrase = phrase;
        phraseInfo.word = newWord.id;
        phrasePromises.push(createPhrase(phraseInfo));
        return phrasePromises;
    }, []);

    /* Go through each word's example and create an Example document */
    const savedExamples = map(examples, async (example) => {
        const exampleData = {
            example,
            parentWord: newWord.id,
        };
        return createExample(exampleData);
    });
    
    /* Wait for all the Phrases and Examples to be created and then add them to the Word document */
    return Promise.all([savedPhrases, savedExamples]).then((res) => {
        const phraseIds = getDocumentsIds(res[0]);
        const exampleIds = getDocumentsIds(res[1]);
        newWord.phrases = phraseIds;
        newWord.examples = exampleIds;
        return newWord.save();
    })
};

export { getWordData };