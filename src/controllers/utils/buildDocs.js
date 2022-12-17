/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import assign from 'lodash/assign';
import map from 'lodash/map';
import flatten from 'lodash/flatten';
import forEach from 'lodash/forEach';
import Versions from '../../shared/constants/Versions';
import { wordSchema } from '../../models/Word';
import { exampleSchema } from '../../models/Example';
import Dialects from '../../shared/constants/Dialects';
import WordAttributes from '../../shared/constants/WordAttributes';
import { createDbConnection, handleCloseConnection } from '../../services/database';

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

/**
 * Creates foundation for Word aggregation pipeline
 * @param {*} match
 * @returns Word aggregation pipeline
 */
const generateAggregationBase = (Model, match) => (
  Model.aggregate()
    .match(match)
);

/* Performs a outer left lookup to append associated examples
 * and returns a plain word object, not a Mongoose Query
 */
export const findWordsWithMatch = async ({
  match,
  version,
  skip = 0,
  limit = 10,
  dialects,
  examples,
}) => {
  const connection = createDbConnection();
  const Word = connection.model('Word', wordSchema);
  try {
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
      .project({
        id: '$_id',
        _id: 0,
        word: 1,
        definitions: 1,
        variations: 1,
        stems: 1,
        updatedAt: 1,
        pronunciation: 1,
        attributes: 1,
        relatedTerms: 1,
        hypernyms: 1,
        hyponyms: 1,
        tenses: 1,
        ...(examples ? { examples: 1 } : {}),
        ...(dialects ? { dialects: 1 } : {}),
      })
      .append([
        { $unset: `attributes.${WordAttributes.IS_COMPLETE.value}` },
        { $unset: `attributes.${WordAttributes.IS_BORROWED_TERM.value}` },
      ])
      .sort({ definitions: -1 });

    const allWords = examples ? removeKeysInNestedDoc(await words, 'examples') : await words;
    const contentLength = allWords.length;
    const finalWords = allWords.slice(skip, skip + limit);

    finalWords.forEach((word) => {
      if (version === Versions.VERSION_1) {
        word.wordClass = word.definitions[0].wordClass;
        word.definitions = flatten(word.definitions.map(({ definitions }) => definitions));
        word.nsibidi = word.definitions[0].nsibidi;
        if (dialects) {
          word.dialects = (word.dialects || []).reduce((finalDialects, dialect) => ({
            ...finalDialects,
            [dialect.word]: {
              ...dialect,
              dialects: dialect.dialects.map((d) => Dialects[d].label),
            },
          }), {});
        }
      }
    });

    await handleCloseConnection(connection);
    return { words: finalWords, contentLength };
  } catch (err) {
    await handleCloseConnection(connection);
    throw err;
  }
};

export const findExamplesWithMatch = async ({
  match,
  version,
  skip = 0,
  limit = 10,
}) => {
  const connection = createDbConnection();
  const Example = connection.model('Example', exampleSchema);
  try {
    let examples = generateAggregationBase(Example, match);

    examples = examples
      .project({
        id: '$_id',
        _id: 0,
        igbo: 1,
        english: 1,
        meaning: 1,
        style: 1,
        associatedWords: 1,
        ...(version === Versions.VERSION_2 ? { associatedDefinitionsSchemas: 1 } : {}),
        pronunciation: 1,
      });

    const allExamples = await examples;
    const contentLength = allExamples.length;
    const finalExamples = allExamples.slice(skip, skip + limit);

    await handleCloseConnection(connection);
    return { examples: finalExamples, contentLength };
  } catch (err) {
    await handleCloseConnection(connection);
    throw err;
  }
};
