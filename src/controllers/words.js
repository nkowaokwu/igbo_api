import { map } from 'lodash';
import removePrefix from '../shared/utils/removePrefix';
import Word from '../models/Word';
import { findSearchWord } from '../services/words';
import { NO_PROVIDED_TERM } from '../shared/constants/errorMessages';
import { getDocumentsIds } from '../shared/utils/documentUtils';
import { POPULATE_EXAMPLE } from '../shared/constants/populateDocuments';
import createRegExp from '../shared/utils/createRegExp';
import { createQueryRegex, sortDocsByDefinitions, paginate } from './utils';
import { createExample } from './examples';

/* Gets words from JSON dictionary */
export const getWordData = (req, res) => {
  const { keyword } = req.query;
  const searchWord = removePrefix(keyword);
  if (!searchWord) {
    res.status(400);
    res.send(NO_PROVIDED_TERM);
  }
  const regexWord = createRegExp(searchWord);
  return res.send(findSearchWord(regexWord, searchWord));
};

/* Searches for a word with Igbo stored in MongoDB */
export const searchWordUsingIgbo = (regex) => (
  Word
    .find({ $or: [{ word: { $regex: regex } }, { variations: { $in: [regex] } }] })
    .populate(POPULATE_EXAMPLE)
);

/* Searches for word with English stored in MongoDB */
export const searchWordUsingEnglish = (regex) => (
  Word
    .find({ definitions: { $in: [regex] } })
    .populate(POPULATE_EXAMPLE)
);

const getWordsUsingEnglish = async (res, regex, searchWord, page) => {
  const words = await searchWordUsingEnglish(regex);
  const sortedWords = sortDocsByDefinitions(searchWord, words);
  return paginate(res, sortedWords, page);
};

/* Gets words from MongoDB */
export const getWords = async (req, res) => {
  const { keyword = '', page: pageQuery } = req.query;
  const searchWord = removePrefix(keyword || '');
  const page = parseInt(pageQuery, 10) || 0;
  const regexKeyword = createQueryRegex(searchWord);
  const words = await searchWordUsingIgbo(regexKeyword);

  if (!words.length) {
    return getWordsUsingEnglish(res, regexKeyword, searchWord, page);
  }
  return paginate(res, words, page);
};

/* Creates Word documents in MongoDB database */
export const createWord = async (data) => {
  const {
    examples,
    word,
    wordClass,
    definitions,
    variations,
    stems,
  } = data;
  const wordData = {
    word,
    wordClass,
    definitions,
    variations,
    stems,
  };
  const newWord = new Word(wordData);
  await newWord.save();

  /* Go through each word's example and create an Example document */
  const savedExamples = map(examples, async (example) => {
    const exampleData = {
      ...example,
      associatedWords: [newWord.id],
    };
    return createExample(exampleData);
  });

  /* Wait for all the Examples to be created and then add them to the Word document */
  const resolvedExamples = await Promise.all(savedExamples);
  const exampleIds = getDocumentsIds(resolvedExamples);
  newWord.examples = exampleIds;
  return newWord.save();
};
