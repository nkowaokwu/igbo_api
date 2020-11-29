import { assign, map, filter } from 'lodash';
import mongoose from 'mongoose';
import removePrefix from '../shared/utils/removePrefix';
import Word from '../models/Word';
import ExampleSuggestion from '../models/ExampleSuggestion';
import { findSearchWord } from '../services/words';
import SuggestionTypes from '../shared/constants/suggestionTypes';
import { NO_PROVIDED_TERM } from '../shared/constants/errorMessages';
import { getDocumentsIds } from '../shared/utils/documentUtils';
import createRegExp from '../shared/utils/createRegExp';
import {
  sortDocsBy,
  packageResponse,
  handleQueries,
  updateDocumentMerge,
} from './utils';
import { searchIgboRegexQuery, searchEnglishRegexQuery } from './utils/queries';
import { findWordsWithMatch } from './utils/buildDocs';
import { createExample, executeMergeExample } from './examples';
import { findGenericWordById } from './genericWords';
import { findWordSuggestionById } from './wordSuggestions';
import { sendMergedEmail } from './email';
import { DICTIONARY_APP_URL } from '../config';

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
export const getWords = async (req, res) => {
  try {
    const {
      searchWord,
      regexKeyword,
      range,
      skip,
      limit,
      ...rest
    } = handleQueries(req);
    const searchQueries = { searchWord, skip, limit };
    let regexMatch = searchIgboRegexQuery(regexKeyword);
    const words = await searchWordUsingIgbo({ query: regexMatch, ...searchQueries });
    if (!words.length) {
      regexMatch = searchEnglishRegexQuery(regexKeyword);
      const englishWords = await searchWordUsingEnglish({ query: regexMatch, ...searchQueries });
      return packageResponse({
        res,
        docs: englishWords,
        model: Word,
        query: regexMatch,
        ...rest,
      });
    }
    return packageResponse({
      res,
      docs: words,
      model: Word,
      query: regexMatch,
      ...rest,
    });
  } catch (err) {
    res.status(400);
    return res.send({ error: err.message });
  }
};

/* Returns a word from MongoDB using an id */
export const getWord = (req, res) => {
  const { id } = req.params;

  return findWordsWithMatch({ match: { _id: mongoose.Types.ObjectId(id) }, limit: 1 })
    .then(async ([word]) => {
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

const updateSuggestionAfterMerge = async (suggestionDoc, originalWordDoc, mergedBy) => {
  const updatedSuggestionDoc = await updateDocumentMerge(suggestionDoc, originalWordDoc.id, mergedBy);
  const exampleSuggestions = await ExampleSuggestion.find({ associatedWords: suggestionDoc.id });
  await Promise.all(map(exampleSuggestions, async (exampleSuggestion) => {
    const removeSuggestionAssociatedIds = assign(exampleSuggestion);
    /* Before creating new Example from ExampleSuggestion,
     * all associated word suggestion ids must be removed
     */
    removeSuggestionAssociatedIds.associatedWords = filter(
      exampleSuggestion.associatedWords,
      (associatedWord) => associatedWord.toString() !== suggestionDoc.id.toString(),
    );
    if (!removeSuggestionAssociatedIds.associatedWords.includes(originalWordDoc.id)) {
      removeSuggestionAssociatedIds.associatedWords.push(originalWordDoc.id);
    }
    const updatedExampleSuggestion = await removeSuggestionAssociatedIds.save();
    return executeMergeExample(updatedExampleSuggestion.id);
  }));
  return updatedSuggestionDoc.save();
};

/* Merges new data into an existing Word document */
const mergeIntoWord = (suggestionDoc, mergedBy) => (
  Word.findOneAndUpdate({ _id: suggestionDoc.originalWordId }, suggestionDoc.toObject())
    .then(async (originalWord) => {
      if (!originalWord) {
        throw new Error('Word doesn\'t exist');
      }
      await updateSuggestionAfterMerge(suggestionDoc, originalWord.toObject(), mergedBy);
      return (await findWordsWithMatch({ match: { _id: suggestionDoc.originalWordId }, limit: 1 }))[0];
    })
    .catch((error) => {
      throw new Error(error.message);
    })
);

/* Creates a new Word document from an existing WordSuggestion or GenericWord document */
const createWordFromSuggestion = (suggestionDoc, mergedBy) => (
  createWord(suggestionDoc.toObject())
    .then(async (word) => {
      await updateSuggestionAfterMerge(suggestionDoc, word, mergedBy);
      return word;
    })
    .catch(() => {
      throw new Error('An error occurred while saving the new word.');
    })
);

/* Merges the existing WordSuggestion of GenericWord into either a brand
 * new Word document or merges into an existing Word document */
export const mergeWord = async (req, res) => {
  const { body: data } = req;
  const { user } = req;
  const suggestionDoc = (await findWordSuggestionById(data.id)) || (await findGenericWordById(data.id));

  if (!user || (user && !user.uid)) {
    res.status(400);
    return res.send({ error: 'User uid is required' });
  }

  if (!suggestionDoc) {
    res.status(400);
    return res.send({
      error: 'There is no associated generic word or word suggestion, double check your provided data',
    });
  }

  if (!suggestionDoc.word) {
    res.status(400);
    return res.send({ error: 'The word property is missing, double check your provided data' });
  }

  if (!suggestionDoc.wordClass) {
    res.status(400);
    return res.send({ error: 'The word class property is missing, double check your provided data' });
  }

  if (!suggestionDoc.definitions) {
    res.status(400);
    return res.send({ error: 'The definition property is missing, double check your provided data' });
  }

  if (!suggestionDoc.id) {
    res.status(400);
    return res.send({ error: 'The id property is missing, double check your provided data' });
  }

  try {
    const result = suggestionDoc.originalWordId
      ? await mergeIntoWord(suggestionDoc, user.uid)
      : await createWordFromSuggestion(suggestionDoc, user.uid);
    /* Sends confirmation merged email to user if they provided an email */
    if (result.userEmail) {
      sendMergedEmail({
        to: result.userEmail,
        suggestionType: SuggestionTypes.WORD,
        submissionLink: `${DICTIONARY_APP_URL}/word?word=${result.word}`,
        ...result,
      });
    }
    return res.send(result);
  } catch (error) {
    return res.send({ error: error.message });
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
