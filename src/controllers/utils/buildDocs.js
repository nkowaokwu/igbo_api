/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */

import { assign, map, forEach } from 'lodash';
import Word from '../../models/Word';

/**
 * Removes _id and __v from nested documents
 * Normalizes (removes accent marks) from word and example's igbo
 */
const removeKeysInNestedDoc = (docs, nestedDocsKey) => {
  forEach(docs, (doc) => {
    doc[nestedDocsKey] = map(doc[nestedDocsKey], (nestedDoc) => {
      const updatedNestedDoc = assign(nestedDoc, { id: nestedDoc._id });
      delete updatedNestedDoc._id;
      delete updatedNestedDoc.__v;
      return updatedNestedDoc;
    });
  });
  return docs;
};

/* Depending on whether or not a search term is provided,
 * the sort by key will be determined */
const determineSorting = (match) => {
  if (match.$text) {
    if (match.$text.$search) {
      return { word: { $meta: 'textScore' } };
    }
  } else if (match.word) {
    return { word: 1, _id: 1 };
  }
  return { 'definitions.0': 1 };
};

/* Performs a outer left lookup to append associated examples
 * and returns a plain word object, not a Mongoose Query
 */
export const findWordsWithMatch = async ({
  match,
  skip = 0,
  limit = 10,
  dialects,
  examples,
}) => {
  let words = Word.aggregate()
    .match(match)
    .sort(determineSorting(match));

  if (examples) {
    words = words
      .lookup({
        from: 'examples',
        localField: '_id',
        foreignField: 'associatedWords',
        as: 'examples',
      });
  }

  words = words
    .collation({
      locale: 'ig',
      caseFirst: 'upper',
      alternate: 'shifted',
      maxVariable: 'space',
    })
    .project({
      id: '$_id',
      _id: 0,
      word: 1,
      wordClass: 1,
      definitions: 1,
      variations: 1,
      stems: 1,
      updatedOn: 1,
      pronunciation: 1,
      isCentralIgbo: 1,
      ...(examples ? { examples: 1 } : {}),
      ...(dialects ? { dialects: 1 } : {}),
    })
    .skip(skip)
    .limit(limit);

  return examples ? removeKeysInNestedDoc(await words, 'examples') : words;
};
