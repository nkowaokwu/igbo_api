import {
  keys,
  reduce,
  map,
  filter,
  forEach,
  some,
  uniqBy,
} from 'lodash';
import removePrefix from '../shared/utils/removePrefix';
import Word from '../models/Word';
import { findSearchWord } from '../services/words';
import { NO_PROVIDED_TERM } from '../shared/constants/errorMessages';
import { getDocumentsIds } from '../shared/utils/documentUtils';
import { POPULATE_EXAMPLE, POPULATE_PHRASE } from '../shared/constants/populateDocuments';
import createRegExp from '../shared/utils/createRegExp';
import { createQueryRegex, sortDocsByDefinitions } from './utils';
import { createPhrase, searchPhraseUsingEnglish, searchPhraseUsingIgbo } from './phrases';
import { createExample } from './examples';

const RESPONSE_LIMIT = 10;

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

/* Wrapper function to prep response by limiting number of words */
const sendWords = (res, words, page) => (
  res.send(words.slice(page * RESPONSE_LIMIT, RESPONSE_LIMIT * (page + 1)))
);

/* Searches for a word with Igbo stored in MongoDB */
export const searchWordUsingIgbo = (regex) => (
  Word
    .find({ $or: [{ word: { $regex: regex } }, { variations: { $in: [regex] } }] })
    .populate(POPULATE_PHRASE)
    .populate(POPULATE_EXAMPLE)
);

/* Searches for word with English stored in MongoDB */
export const searchWordUsingEnglish = (regex) => (
  Word
    .find({ definitions: { $in: [regex] } })
    .populate(POPULATE_PHRASE)
    .populate(POPULATE_EXAMPLE)
);

const searchWordUsingId = (id) => (
  Word
    .findById(id)
    .populate(POPULATE_PHRASE)
    .populate(POPULATE_EXAMPLE)
);

/* Returns list of phrases where their parentWord is a word that
hasn't been queried and returned by mongoose */
const filterUniqueParentWords = ({ words, phrases }) => {
  const distinctPhrases = filter(phrases, (phrase) => (
    !some(words, (word) => word.id === phrase.parentWord.toString())
  ));
  return uniqBy(distinctPhrases, (phrase) => phrase.parentWord.toString());
};

const getParentWords = (words, phrases, page) => {
  const distinctPhrasesSet = filterUniqueParentWords({ words, phrases });
  return map(distinctPhrasesSet, ({ parentWord }) => searchWordUsingId(parentWord, page));
};

/* Finds all parentWords of word phrases that haven't
been queried and returned by mongoose yet using Igbo */
const getNotYetQueriedParentWordsUsingIgbo = async ({ words, regex, page }) => {
  const phrasesUsingIgbo = await searchPhraseUsingIgbo(regex);
  const phrases = phrasesUsingIgbo;
  const parentWords = getParentWords(words, phrases, page);
  return Promise.all(parentWords);
};

/* Finds all parentWords of word phrases that haven't
been queried and returned by mongoose yet using English */
const getNotYetQueriedParentWordsUsingEnglish = async ({ words, regex, page }) => {
  const phrasesUsingEnglish = await searchPhraseUsingEnglish(regex);
  const phrases = phrasesUsingEnglish;
  const parentWords = getParentWords(words, phrases, page);
  return Promise.all(parentWords);
};

const getWordsUsingEnglish = async (res, regex, searchWord, page) => {
  const words = await searchWordUsingEnglish(regex);
  const uniqueParentWords = regex.toString() !== '/./'
    ? await getNotYetQueriedParentWordsUsingEnglish({ words, regex }) : [];
  const combinedWords = [...uniqueParentWords, ...words];
  forEach(combinedWords, ({ phrases }) => sortDocsByDefinitions(searchWord, phrases));
  const sortedWords = sortDocsByDefinitions(searchWord, combinedWords);
  return sendWords(res, sortedWords, page);
};

/* Gets words from MongoDB */
export const getWords = async (req, res) => {
  const { keyword = '', page: pageQuery } = req.query;
  const searchWord = removePrefix(keyword || '');
  const page = parseInt(pageQuery, 10) || 0;
  const regexKeyword = createQueryRegex(searchWord);
  const words = await searchWordUsingIgbo(regexKeyword);
  const uniqueParentWords = regexKeyword.toString() !== '/./'
    ? await getNotYetQueriedParentWordsUsingIgbo({ words, regex: regexKeyword }) : [];
  const combinedWords = [...words, ...uniqueParentWords];

  if (!combinedWords.length) {
    return getWordsUsingEnglish(res, regexKeyword, searchWord, page);
  }
  return sendWords(res, combinedWords, page);
};

/* Creates Word documents in MongoDB database */
export const createWord = async (data) => {
  const {
    examples,
    word,
    wordClass,
    definitions,
    variations,
  } = data;
  const wordData = {
    word,
    wordClass,
    definitions,
    variations,
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
  const resolvedPhrases = await Promise.all(savedPhrases);
  const resolvedExamples = await Promise.all(savedExamples);
  const phraseIds = getDocumentsIds(resolvedPhrases);
  const exampleIds = getDocumentsIds(resolvedExamples);
  newWord.phrases = phraseIds;
  newWord.examples = exampleIds;
  return newWord.save();
};
