import {
  assign,
  every,
  has,
  partial,
  forIn,
} from 'lodash';
import GenericWord from '../models/GenericWord';
import testGenericWordsDictionary from '../../tests/__mocks__/genericWords.mock.json';
import genericWordsDictionary from '../dictionaries/ig-en/ig-en_normalized_expanded.json';
import { prepResponse, handleQueries } from './utils';

const REQUIRE_KEYS = ['word', 'wordClass', 'definitions'];

/* Updates an existing WordSuggestion object */
export const putGenericWord = (req, res) => {
  const { body: data, params: { id } } = req;
  if (!every(REQUIRE_KEYS, partial(has, data))) {
    res.status(400);
    return res.send({ error: 'Required information is missing, double check your provided data' });
  }

  return GenericWord.findById(id)
    .then(async (genericWord) => {
      if (!genericWord) {
        res.status(400);
        return res.send({ error: 'Generic word doesn\'t exist' });
      }
      const updatedGenericWord = assign(genericWord, data);
      return res.send(await updatedGenericWord.save());
    })
    .catch((err) => {
      console.log(err);
      res.status(400);
      return res.send({ error: 'An error has occurred while updating, double check your provided data' });
    });
};

/* Returns all existing GenericWord objects */
export const getGenericWords = (req, res) => {
  const { regexKeyword, page, sort } = handleQueries(req.query);
  return GenericWord.find({ word: regexKeyword })
    .then((genericWords) => (
      prepResponse(res, genericWords, page, sort)
    ))
    .catch(() => {
      res.status(400);
      return res.send({ error: 'An error has occurred while returning all generic words' });
    });
};

export const findGenericWordById = (id) => (
  GenericWord.findById(id)
);

/* Returns a single WordSuggestion by using an id */
export const getGenericWord = (req, res) => {
  const { id } = req.params;
  return findGenericWordById(id)
    .then((genericWord) => {
      if (!genericWord) {
        res.status(400);
        return res.send({ error: 'No genericWord exists with the provided id.' });
      }
      return res.send(genericWord);
    })
    .catch(() => {
      res.status(400);
      return res.send({ error: 'An error has occurred while return a single word suggestion' });
    });
};

/* Populates the MongoDB database with GenericWords */
export const createGenericWords = (_, res) => {
  const genericWordsPromises = [];
  const dictionary = process.env.NODE_ENV === 'test' ? testGenericWordsDictionary : genericWordsDictionary;
  forIn(dictionary, (value, key) => {
    const newGenericWords = new GenericWord({
      word: key,
      definitions: value,
    });
    genericWordsPromises.push(newGenericWords.save());
  });

  Promise.all(genericWordsPromises)
    .then(() => (
      res.send({ message: 'Successfully populated generic words' })
    ))
    .catch(() => {
      res.status(400);
      return res.send({ error: 'An error has occurred while populating generic words' });
    });
};
