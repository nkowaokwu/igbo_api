/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */

import { assign, map, forEach } from 'lodash';
import accents from 'remove-accents';
import Word from '../../models/Word';

/**
 * Removes _id and __v from nested documents
 * Normalizes (removes accent marks) from word and example's igbo
 */
const removeKeysInNestedDoc = (docs, nestedDocsKey) => {
  forEach(docs, (doc) => {
    // Handles removing accent marks for word
    doc.word = accents.remove(doc.word);
    doc[nestedDocsKey] = map(doc[nestedDocsKey], (nestedDoc) => {
      const updatedNestedDoc = assign(nestedDoc, { id: nestedDoc._id });
      if (nestedDocsKey === 'examples') {
        // Handles remove accent marks for example's igbo
        updatedNestedDoc.igbo = accents.remove(updatedNestedDoc.igbo);
      }
      delete updatedNestedDoc._id;
      delete updatedNestedDoc.__v;
      return updatedNestedDoc;
    });
  });
  return docs;
};

/* Performs a outer left lookup to append associated examples
 * and returns a plain word object, not a Mongoose Query
 */
export const findWordsWithMatch = async ({ match, skip = 0, limit = 10 }) => {
  const words = await Word.aggregate()
    .match(match)
    .lookup({
      from: 'examples',
      localField: '_id',
      foreignField: 'associatedWords',
      as: 'examples',
    })
    .skip(skip)
    .limit(limit)
    .project({
      id: '$_id',
      _id: 0,
      word: 1,
      wordClass: 1,
      definitions: 1,
      variations: 1,
      stems: 1,
      normalized: 1,
      examples: 1,
      updatedOn: 1,
      accented: 1,
    });

  return removeKeysInNestedDoc(words, 'examples');
};
