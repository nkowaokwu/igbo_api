import { assign, map } from 'lodash';
import removePrefix from '../shared/utils/removePrefix';
import Word from '../models/Word';
import { findSearchWord } from '../services/words';
import { NO_PROVIDED_TERM } from '../shared/constants/errorMessages';
import { getDocumentsIds } from '../shared/utils/documentUtils';
import { POPULATE_EXAMPLE } from '../shared/constants/populateDocuments';
import createRegExp from '../shared/utils/createRegExp';
import {
  sortDocsByDefinitions,
  prepResponse,
  handleQueries,
} from './utils';
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

const getWordsUsingEnglish = async (regex, searchWord) => {
  const words = await searchWordUsingEnglish(regex);
  const sortedWords = sortDocsByDefinitions(searchWord, words);
  return sortedWords;
};

/* Gets words from MongoDB */
export const getWords = async (req, res) => {
  const {
    searchWord,
    regexKeyword,
    page,
    sort,
  } = handleQueries(req.query);
  const words = await searchWordUsingIgbo(regexKeyword);

  if (!words.length) {
    const englishWords = await getWordsUsingEnglish(regexKeyword, searchWord, page);
    return prepResponse(res, englishWords, page, sort);
  }
  return prepResponse(res, words, page, sort);
};

/* Returns a word from MongoDB using an id */
export const getWord = (req, res) => {
  const { id } = req.params;
  return Word.findById(id)
    .then((word) => {
      if (!word) {
        res.status(400);
        return res.send({ error: 'No word exists with the provided id.' });
      }
      return res.send(word);
    })
    .catch(() => {
      res.status(400);
      return res.send({ error: 'An error has occurred while returning a single word.' });
    });
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

/* Call the createWord helper function and returns status to client */
export const postWord = (req, res) => {
  const { body: data } = req;

  if (!data.word) {
    res.status(400);
    return res.send({ error: 'The word property is missing, double check your provided data' });
  }

  try {
    return createWord(data)
      .then((word) => (
        res.send({ id: word.id })
      ))
      .catch(() => {
        res.status(400);
        return res.send({ error: 'An error occurred while saving the new word.' });
      });
  } catch {
    res.send(400);
    return res.send({ error: 'An error has occurred during the word and example creation process.' });
  }
};

/* Updates a Word document in the database */
export const putWord = (req, res) => {
  const { body: data, params: { id } } = req;
  if (!data.word) {
    res.status(400);
    return res.send({ error: 'Required information is missing, double your provided data.' });
  }

  return Word.findById(id)
    .then(async (word) => {
      if (!word) {
        res.status(400);
        return res.send({ error: 'Word doesn\'t exist' });
      }
      const updatedWord = assign(word, data);
      return res.send(await updatedWord.save());
    })
    .catch(() => {
      res.status(400);
      return res.send({ error: 'An error has occurred while updating the word, double check your provided data.' });
    });
};
