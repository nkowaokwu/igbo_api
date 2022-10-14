/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */

import { assign, map, forEach } from 'lodash';
import Word from '../../models/Word';
import Dialects from '../../shared/constants/Dialects';
import WordAttributes from '../../shared/constants/WordAttributes';

/**
 * Collation config
 */
const collationConfig = {
  locale: 'ig',
  alternate: 'shifted',
  maxVariable: 'space',
  strength: 1,
  normalization: true,
};

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

/**
 * Creates foundation for Word aggregation pipeline
 * @param {*} match
 * @returns Word aggregation pipeline
 */
const generateAggregationBase = (Model, match) => (
  Model.aggregate()
    .match(match)
    .sort(determineSorting(match))
);

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
  let words = generateAggregationBase(Word, match);

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
    .collation(collationConfig)
    .project({
      id: '$_id',
      _id: 0,
      word: 1,
      wordClass: 1,
      definitions: 1,
      variations: 1,
      stems: 1,
      updatedAt: 1,
      pronunciation: 1,
      attributes: 1,
      relatedTerms: 1,
      hypernyms: 1,
      hyponyms: 1,
      nsibidi: 1,
      tenses: 1,
      ...(examples ? { examples: 1 } : {}),
      ...(dialects ? { dialects: 1 } : {}),
    })
    .append([
      { $unset: `attributes.${WordAttributes.IS_COMPLETE.value}` },
      { $unset: `attributes.${WordAttributes.IS_BORROWED_TERM.value}` },
      { $unset: `attributes.${WordAttributes.IS_CONSTRUCTED_TERM.value}` },
    ])
    .sort({ definitions: -1 })
    .skip(skip)
    .limit(limit);

  const finalWords = examples ? removeKeysInNestedDoc(await words, 'examples') : await words;
  finalWords.forEach((word) => {
    Object.keys(word?.dialects || {}).forEach((key) => {
      word.dialects[key].dialects = (
        word.dialects[key].dialects.map((dialect) => Dialects[dialect].label)
      );
    });
  });
  return finalWords;
};

/*
 * Counts total number of documents associated with query match
 */
export const findWordsWithMatchCount = async ({ model, match }) => (
  (await generateAggregationBase(model, match)
    .collation(collationConfig)
    .project({ id: '$_id' }))
    .length
);
