import mongoose from 'mongoose';
import {
  assign,
  every,
  has,
  partial,
} from 'lodash';
import WordSuggestion from '../models/WordSuggestion';
import { paginate } from './utils/index';

const REQUIRE_KEYS = ['id', 'word', 'wordClass', 'definitions'];

/* Creates a new WordSuggestion document in the database */
export const postWordSuggestion = (req, res) => {
  const { body: data } = req;

  if (!mongoose.Types.ObjectId.isValid(data.originalWordId)) {
    res.status(400);
    return res.send({ error: 'Invalid word id provided' });
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

/* Updates an existing WordSuggestion object */
export const putWordSuggestion = (req, res) => {
  const { body: data } = req;
  if (!every(REQUIRE_KEYS, partial(has, data))) {
    res.status(400);
    return res.send({ error: 'Required information is missing, double check your provided data' });
  }

  return WordSuggestion.findById(data.id)
    .then(async (wordSuggestion) => {
      const updatedWordSuggestion = assign(wordSuggestion, data);
      res.send(await updatedWordSuggestion.save());
    })
    .catch(() => {
      res.status(400);
      return res.send({ error: 'An error has occurred while updating, double check your provided data' });
    });
};

/* Returns all existing WordSuggestion objects */
export const getWordSuggestions = (req, res) => {
  const { page: pageQuery } = req.query;
  const page = parseInt(pageQuery, 10) || 0;
  WordSuggestion.find()
    .then((wordSuggestions) => (
      paginate(res, wordSuggestions, page)
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
    .then((wordSuggestion) => (
      res.send(wordSuggestion)
    ))
    .catch(() => {
      res.status(400);
      return res.send({ error: 'An error has occurred while returning a single word suggestion' });
    });
};
