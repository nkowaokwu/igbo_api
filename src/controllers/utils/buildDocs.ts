/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import { Aggregate, Model } from 'mongoose';
import { assign, map, flatten, forEach, omit } from 'lodash';
import Version from '../../shared/constants/Version';
import { wordSchema } from '../../models/Word';
import { exampleSchema } from '../../models/Example';
import Dialects from '../../shared/constants/Dialect';
import WordAttributes from '../../shared/constants/WordAttributes';
import { createDbConnection, handleCloseConnection } from '../../services/database';
import WordModel, { WordDialect } from '../../models/interfaces/Word';
import ExampleModel from '../../models/interfaces/Example';

/**
 * Removes _id and __v from nested documents
 * Normalizes (removes accent marks) from word and example's igbo
 */
const removeKeysInNestedDoc = (docs: WordModel[], nestedDocsKey: string) => {
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
const generateAggregationBase = <T>(MongooseModel: Model<T>, match: object): Aggregate<T[]> =>
  MongooseModel.aggregate().match(match);

/* Performs a outer left lookup to append associated examples
 * and returns a plain word object, not a Mongoose Query
 */
export const findWordsWithMatch = async ({
  match,
  version,
  lean = false,
}: {
  match: object;
  version: Version;
  lean?: boolean;
}) => {
  const connection = createDbConnection();
  const Word = connection.model<WordModel>('Word', wordSchema);
  console.time('Aggregation completion time');
  try {
    let words = generateAggregationBase<WordModel>(Word, match);

    if (!lean) {
      words = words.lookup({
        from: 'examples',
        localField: '_id',
        foreignField: 'associatedWords',
        as: 'examples',
      });
    }

    if (!lean && version === Version.VERSION_2) {
      words = words.lookup({
        from: 'words',
        localField: 'stems',
        foreignField: '_id',
        as: 'stems',
      });

      words = words.lookup({
        from: 'words',
        localField: 'relatedTerms',
        foreignField: '_id',
        as: 'relatedTerms',
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
        relatedTerms: 1,
        updatedAt: 1,
        pronunciation: 1,
        attributes: 1,
        tenses: 1,
        examples: 1,
        dialects: 1,
        tags: 1,
      })
      .append({ $unset: `attributes.${WordAttributes.IS_COMPLETE.value}` });

    const cleanedWords = removeKeysInNestedDoc(await words, 'examples');
    const contentLength = cleanedWords.length;

    const finalWords = cleanedWords.map((wordDocument) => {
      if (version === Version.VERSION_1) {
        const word: {
          wordClass: string;
          nsibidi: string;
          definitions: string[];
          dialects: { [key: string]: WordDialect };
        } = { ...assign(wordDocument), wordClass: '', nsibidi: '', definitions: [], dialects: {} };
        word.wordClass = wordDocument.definitions[0].wordClass as string;
        word.nsibidi = wordDocument.definitions[0].nsibidi;
        word.definitions = flatten(wordDocument.definitions.map(({ definitions }) => definitions));
        word.dialects = (wordDocument.dialects || []).reduce(
          (finalDialects, dialect) => ({
            ...finalDialects,
            [dialect.word]: {
              ...dialect,
              dialects: dialect.dialects.map((d) => Dialects[d].label),
            },
          }),
          {},
        );
        delete wordDocument.tags;
      }
      return wordDocument;
    });

    console.timeEnd('Aggregation completion time');
    await handleCloseConnection(connection);
    return { words: finalWords, contentLength };
  } catch (err) {
    console.timeEnd('Aggregation completion time');
    await handleCloseConnection(connection);
    throw err;
  }
};

export const findExamplesWithMatch = async ({ match, version }: { match: object; version: Version }) => {
  const connection = createDbConnection();
  const Example = connection.model<ExampleModel>('Example', exampleSchema);
  try {
    let examples = generateAggregationBase<ExampleModel>(Example, match);

    examples = examples.project({
      id: '$_id',
      _id: 0,
      igbo: 1,
      english: 1,
      meaning: 1,
      style: 1,
      associatedWords: 1,
      ...(version === Version.VERSION_2 ? { associatedDefinitionsSchemas: 1 } : {}),
      pronunciations: 1,
    });

    // Returns only the first pronunciation for the example sentence
    const allExamples = (await examples).map((example) =>
      omit({ ...example, pronunciation: example.pronunciations[0]?.audio }, ['pronunciation']),
    );
    const contentLength = allExamples.length;

    await handleCloseConnection(connection);
    return { examples: allExamples, contentLength };
  } catch (err) {
    await handleCloseConnection(connection);
    throw err;
  }
};
