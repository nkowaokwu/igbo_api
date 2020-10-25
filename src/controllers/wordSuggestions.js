import mongoose from 'mongoose';
import {
  assign,
  every,
  has,
  partial,
  map,
  trim,
} from 'lodash';
import WordSuggestion from '../models/WordSuggestion';
import { prepResponse, handleQueries } from './utils';

const REQUIRE_KEYS = ['word', 'wordClass', 'definitions'];

/* Creates a new WordSuggestion document in the database */
export const postWordSuggestion = (req, res) => {
  const { body: data } = req;

  if (data.originalWordId && !mongoose.Types.ObjectId.isValid(data.originalWordId)) {
    res.status(400);
    return res.send({ error: 'Invalid word id provided' });
  }

  if (!Array.isArray(data.definitions)) {
    data.definitions = map(data.definitions.split(','), (definition) => trim(definition));
  }

  const newWordSuggestion = new WordSuggestion(data);
  return newWordSuggestion.save()
    .then((wordSuggestion) => (
      res.send({ id: wordSuggestion.id })
    ))
    .catch(() => {
      res.status(400);
      return res.send({ error: 'An error has occurred while saving, double check your provided data' });
    });
};

export const findWordSuggestionById = (id) => (
  WordSuggestion.findById(id)
);

/* Updates an existing WordSuggestion object */
export const putWordSuggestion = (req, res) => {
  const { body: data, params: { id } } = req;
  if (!every(REQUIRE_KEYS, partial(has, data))) {
    res.status(400);
    return res.send({ error: 'Required information is missing, double check your provided data' });
  }

  if (!Array.isArray(data.definitions)) {
    data.definitions = map(data.definitions.split(','), (definition) => trim(definition));
  }

  return findWordSuggestionById(id)
    .then(async (wordSuggestion) => {
      if (!wordSuggestion) {
        res.status(400);
        return res.send({ error: 'Word suggestion doesn\'t exist' });
      }
      const updatedWordSuggestion = assign(wordSuggestion, data);
      return res.send(await updatedWordSuggestion.save());
    })
    .catch(() => {
      res.status(400);
      return res.send({ error: 'An error has occurred while updating, double check your provided data' });
    });
};

/* Returns all existing WordSuggestion objects */
export const getWordSuggestions = (req, res) => {
  const { regexKeyword, page, sort } = handleQueries(req.query);
  WordSuggestion
    .find({ word: regexKeyword })
    .sort({ approvals: 'desc' })
    .then((wordSuggestions) => (
      prepResponse(res, wordSuggestions, page, sort)
    ))
    .catch(() => {
      res.status(400);
      return res.send({
        error: 'An error has occurred while returning word suggestions',
      });
    });
};

/* Returns a single WordSuggestion by using an id */
export const getWordSuggestion = (req, res) => {
  const { id } = req.params;
  return WordSuggestion.findById(id)
    .then((wordSuggestion) => {
      if (!wordSuggestion) {
        res.status(400);
        return res.send({ error: 'No word suggestion exists with the provided id.' });
      }
      return res.send(wordSuggestion);
    })
    .catch(() => {
      res.status(400);
      return res.send({ error: 'An error has occurred while returning a single word suggestion' });
    });
};

/* Deletes a single WordSuggestion by using an id */
export const deleteWordSuggestion = (req, res) => {
  const { id } = req.params;
  return WordSuggestion.findByIdAndDelete(id)
    .then((wordSuggestion) => {
      if (!wordSuggestion) {
        res.status(400);
        return res.send({ error: 'No word suggestion exists with teh provided id.' });
      }
      return res.send(wordSuggestion);
    })
    .catch(() => {
      res.status(400);
      return res.send({ error: 'An error has occurred while deleting and return a single word suggestion' });
    });
};
