import { forIn } from 'lodash';
import GenericWord from '../models/GenericWord';
import testGenericWordsDictionary from '../../tests/__mocks__/genericWords.mock.json';
import genericWordsDictionary from '../dictionaries/ig-en/ig-en_normalized_expanded.json';
import { paginate, handleQueries } from './utils';

/* Returns all existing GenericWord objects */
export const getGenericWords = (req, res) => {
  const { regexKeyword, page } = handleQueries(req.query);
  return GenericWord.find({ word: regexKeyword })
    .then((genericWords) => (
      paginate(res, genericWords, page)
    ))
    .catch(() => {
      res.status(400);
      return res.send({ error: 'An error has occurred while returning all generic words' });
    });
};

/* Returns a single WordSuggestion by using an id */
export const getGenericWord = (req, res) => {
  const { id } = req.params;
  return GenericWord.findById(id)
    .then((genericWord) => (
      res.send(genericWord)
    ))
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
