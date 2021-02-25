import { map } from 'lodash';
import mongoose from 'mongoose';
import removePrefix from '../shared/utils/removePrefix';
import Word from '../models/Word';
import { findSearchWord } from '../services/words';
import Dialects from '../shared/constants/Dialects';
import { NO_PROVIDED_TERM } from '../shared/constants/errorMessages';
import { getDocumentsIds } from '../shared/utils/documentUtils';
import createRegExp from '../shared/utils/createRegExp';
import {
  sortDocsBy,
  packageResponse,
  handleQueries,
} from './utils';
import { searchIgboTextSearch, strictSearchIgboQuery, searchEnglishRegexQuery } from './utils/queries';
import { findWordsWithMatch } from './utils/buildDocs';
import { createExample } from './examples';

/* Gets words from JSON dictionary */
export const getWordData = (req, res, next) => {
  try {
    const { keyword } = req.query;
    const searchWord = removePrefix(keyword);
    if (!searchWord) {
      throw new Error(NO_PROVIDED_TERM);
    }
    const regexWord = createRegExp(searchWord);
    return res.send(findSearchWord(regexWord, searchWord));
  } catch (err) {
    return next(err);
  }
};

/* Searches for a word with Igbo stored in MongoDB */
export const searchWordUsingIgbo = async ({ query, searchWord, ...rest }) => {
  const words = await findWordsWithMatch({ match: query, ...rest });
  return sortDocsBy(searchWord, words, 'word');
};

/* Searches for word with English stored in MongoDB */
export const searchWordUsingEnglish = async ({ query, searchWord, ...rest }) => {
  const words = await findWordsWithMatch({ match: query, ...rest });
  return sortDocsBy(searchWord, words, 'definitions[0]');
};

/* Gets words from MongoDB */
export const getWords = async (req, res, next) => {
  try {
    const {
      searchWord,
      regexKeyword,
      range,
      skip,
      limit,
      strict,
      dialects,
      ...rest
    } = handleQueries(req);
    const searchQueries = {
      searchWord,
      skip,
      limit,
      dialects,
    };
    let query = !strict ? searchIgboTextSearch(searchWord) : strictSearchIgboQuery(searchWord);
    const words = await searchWordUsingIgbo({ query, ...searchQueries });
    if (!words.length) {
      query = searchEnglishRegexQuery(regexKeyword);
      const englishWords = await searchWordUsingEnglish({ query, ...searchQueries });
      return packageResponse({
        res,
        docs: englishWords,
        model: Word,
        query,
        ...rest,
      });
    }
    return packageResponse({
      res,
      docs: words,
      model: Word,
      query,
      ...rest,
    });
  } catch (err) {
    return next(err);
  }
};

/* Returns a word from MongoDB using an id */
export const getWord = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updatedWord = await findWordsWithMatch({ match: { _id: mongoose.Types.ObjectId(id) }, limit: 1 })
      .then(async ([word]) => {
        if (!word) {
          throw new Error('No word exists with the provided id.');
        }
        return word;
      });
    return res.send(updatedWord);
  } catch (err) {
    return next(err);
  }
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

  const dialects = Object.keys(Dialects).reduce((dialectsObject, key) => ({
    ...dialectsObject,
    [key]: {
      word: '',
      variations: '',
      accented: '',
      dialect: key,
      pronunciation: '',
    },
  }), {});

  const wordData = {
    word,
    wordClass,
    definitions,
    variations,
    stems,
    dialects,
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
