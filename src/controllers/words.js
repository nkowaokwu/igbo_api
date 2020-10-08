import {
  keys,
  reduce,
  map,
  filter,
  some,
  uniqBy,
} from 'lodash';
import levenshtein from 'js-levenshtein';
import removePrefix from '../shared/utils/removePrefix';
import Word from '../models/Word';
import { findSearchWord } from '../services/words';
import { NO_PROVIDED_TERM } from '../shared/constants/errorMessages';
import { getDocumentsIds } from '../shared/utils/documentUtils';
import { POPULATE_EXAMPLE, POPULATE_PHRASE } from '../shared/constants/populateDocuments';
import createRegExp from '../shared/utils/createRegExp';
import { createPhrase, searchPhraseUsingIgbo } from './phrases';
import { createExample } from './examples';

/* Either creates a regex pattern for provided searchWord
or fallbacks to matching every word */
const createQueryRegex = (searchWord) => (!searchWord ? /./ : createRegExp(searchWord));

/* Sorts all the words based on the provided searchWord */
const sortWords = (searchWord, words) => {
  words.sort((prevWord, nextWord) => {
    const prevWordDifference = levenshtein(searchWord, prevWord.definitions[0] || '') - 1;
    const nextWordDifference = levenshtein(searchWord, nextWord.definitions[0] || '') - 1;
    return prevWordDifference - nextWordDifference;
  });
  return words;
};

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
export const searchWordUsingIgbo = (regex, page) => (
  Word
    .find({ $or: [{ word: { $regex: regex } }, { variations: { $in: [regex] } }] })
    .populate(POPULATE_PHRASE)
    .populate(POPULATE_EXAMPLE)
    .limit(10)
    .skip(page)
);

/* Searches for word with English stored in MongoDB */
export const searchWordUsingEnglish = (regex, page) => (
  Word
    .find({ definitions: { $in: [regex] } })
    .populate(POPULATE_PHRASE)
    .populate(POPULATE_EXAMPLE)
    .limit(10)
    .skip(page)
);

const searchWordUsingId = (id, page) => (
  Word
    .findById(id)
    .populate(POPULATE_PHRASE)
    .populate(POPULATE_EXAMPLE)
    .limit(10)
    .skip(page)
);

/* Returns list of phrases where their parentWord is a word that
hasn't been queried and returned by mongoose */
const filterUniqueParentWords = ({ words, phrases }) => {
  const distinctPhrases = filter(phrases, (phrase) => (
    !some(words, (word) => word.id === phrase.parentWord.toString())
  ));
  return uniqBy(distinctPhrases, (phrase) => phrase.parentWord.toString());
};

/* Finds all parentWords of word phrases that haven't
been queried and returned by mongoose yet */
const getNotYetQueriedParentWords = async ({ words, regex, page }) => {
  const phrases = await searchPhraseUsingIgbo(regex);
  const distinctPhrasesSet = filterUniqueParentWords({ words, phrases });
  const parentWords = map(distinctPhrasesSet, ({ parentWord }) => searchWordUsingId(parentWord, page));
  return Promise.all(parentWords);
};

const getWordsUsingEnglish = async (res, searchWord, page) => {
  const sortedWords = sortWords(searchWord, await searchWordUsingEnglish(searchWord, page));
  return res.send(sortedWords);
};

/* Gets words from MongoDB */
export const getWords = async (req, res) => {
  const { keyword, page: pageQuery } = req.query;
  const searchWord = removePrefix(keyword || '');
  const page = parseInt(pageQuery, 10) || 0;
  const regexKeyword = createQueryRegex(searchWord);
  const words = await searchWordUsingIgbo(regexKeyword, page);
  const uniqueParentWords = regexKeyword.toString() !== '/./'
    ? await getNotYetQueriedParentWords({ words, regex: regexKeyword }) : [];

  if (!words.length && !uniqueParentWords.length) {
    return getWordsUsingEnglish(res, regexKeyword, page);
  }
  return res.send([...words, ...uniqueParentWords]);
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
