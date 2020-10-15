import { forIn } from 'lodash';
import GenericWord from '../models/GenericWord';
import genericWordsDictionary from '../dictionaries/ig-en/ig-en_normalized_expanded.json';

export const createGenericWords = (_, res) => {
  const genericWordsPromises = [];
  forIn(genericWordsDictionary, (value, key) => {
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
