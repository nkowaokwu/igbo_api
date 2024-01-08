/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import { Aggregate, Model as ModelType, PipelineStage } from 'mongoose';
import { assign, flatten, flow, merge, omit } from 'lodash';
import Version from '../../shared/constants/Version';
import { wordSchema } from '../../models/Word';
import { exampleSchema } from '../../models/Example';
import Dialects from '../../shared/constants/Dialect';
import { createDbConnection, handleCloseConnection } from '../../services/database';
import WordAttributeEnum from '../../shared/constants/WordAttributeEnum';
import {
  Example as ExampleType,
  NsibidiCharacter as NsibidiCharacterType,
  WordDocument,
  LegacyWordDocument,
} from '../../types';
import { ExampleWithPronunciation } from '../types';
import { nsibidiCharacterSchema } from '../../models/NsibidiCharacter';

type NestedDoc = { _id?: string; __v?: number };

/**
 * Removes _id and __v from nested documents
 * Normalizes (removes accent marks) from word and example's igbo
 */
const removeKeysInNestedDoc = <T>(docs: T[], nestedDocsKey: keyof T) => {
  docs.forEach((doc: T) => {
    // @ts-expect-error not assignable to never
    doc[nestedDocsKey] = ((doc[nestedDocsKey] as NestedDoc[]) || []).map((nestedDoc: NestedDoc) => {
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
const generateAggregationBase = <T>(Model: ModelType<T>, match: PipelineStage.Match['$match']): Aggregate<T[]> =>
  Model.aggregate<T>().match(match);

/* Performs a outer left lookup to append associated examples
 * and returns a plain word object, not a Mongoose Query
 */
export const findWordsWithMatch = async ({
  match,
  version,
  lean = false,
  queryLabel = '',
}: {
  match: PipelineStage.Match['$match'];
  version: Version;
  lean?: boolean;
  queryLabel?: string;
}) => {
  const connection = createDbConnection();
  const Word = connection.model<WordDocument>('Word', wordSchema);
  try {
    let words = generateAggregationBase<WordDocument>(Word, match);

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
      .append({ $unset: `attributes.${WordAttributeEnum.IS_COMPLETE}` });

    const cleanedWords = removeKeysInNestedDoc(await words, 'examples');
    const contentLength = cleanedWords.length;

    const finalWords = cleanedWords.map((cleanedWord: WordDocument) => {
      if (version === Version.VERSION_1) {
        // @ts-expect-error mistake to convert WordDocument to LegacyWordDocument
        const word = omit(assign(cleanedWord) as LegacyWordDocument, ['tags']);
        word.wordClass = cleanedWord.definitions[0].wordClass;
        word.nsibidi = cleanedWord.definitions[0].nsibidi;
        word.definitions = flatten(cleanedWord.definitions.map(({ definitions }) => definitions));
        word.dialects = (cleanedWord.dialects || []).reduce(
          (finalDialects, dialect) => ({
            ...finalDialects,
            [dialect.word]: {
              ...dialect,
              dialects: dialect.dialects.map((d) => Dialects[d].label),
            },
          }),
          {}
        );
        return word as LegacyWordDocument;
      }
      return cleanedWord as WordDocument;
    });

    await handleCloseConnection(connection);
    return { words: finalWords, contentLength };
  } catch (err: any) {
    console.log('An error occurred', err);
    await handleCloseConnection(connection);
    throw err;
  }
};

export const findExamplesWithMatch = async ({
  match,
  version,
}: {
  match: Record<string, RegExp | object>;
  version: Version;
}): Promise<{ examples: ExampleWithPronunciation[]; contentLength: number }> => {
  const connection = createDbConnection();
  const Example = connection.model<ExampleType>('Example', exampleSchema);
  try {
    let examples = generateAggregationBase<ExampleType>(Example, match);

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
    const allExamples = (await examples).map((example) => {
      const cleanedExample = merge(example, { pronunciation: '' });
      cleanedExample.pronunciation = cleanedExample.pronunciations[0]?.audio;
      return omit(cleanedExample, ['pronunciations']);
    });
    const contentLength = allExamples.length;

    await handleCloseConnection(connection);
    return { examples: allExamples, contentLength };
  } catch (err) {
    await handleCloseConnection(connection);
    throw err;
  }
};

export const findNsibidiCharactersWithMatch = async ({
  match,
  version,
}: {
  match: Record<string, RegExp | object>;
  version: Version;
}): Promise<{ nsibidiCharacters: NsibidiCharacterType[]; contentLength: number }> => {
  const connection = createDbConnection();
  const NsibidiCharacter = connection.model<NsibidiCharacterType>('NsibidiCharacter', nsibidiCharacterSchema);

  if (version !== Version.VERSION_2) {
    return { nsibidiCharacters: [], contentLength: 0 };
  }

  try {
    let nsibidiCharacters = generateAggregationBase<NsibidiCharacterType>(NsibidiCharacter, match);
    nsibidiCharacters = nsibidiCharacters.project({
      id: '$_id',
      _id: 0,
      nsibidi: 1,
      definitions: 1,
      pronunciation: 1,
      radicals: 1,
      wordClass: 1,
    });

    const cleanNsibidiCharacters = flow([
      (docs) => removeKeysInNestedDoc<NsibidiCharacterType>(docs, 'definitions'),
      (docs) => removeKeysInNestedDoc<NsibidiCharacterType>(docs, 'radicals'),
    ]);
    const cleanedNsibidiCharacters = cleanNsibidiCharacters(await nsibidiCharacters);
    const contentLength = cleanedNsibidiCharacters.length;

    await handleCloseConnection(connection);
    return { nsibidiCharacters: cleanedNsibidiCharacters, contentLength };
  } catch (err) {
    await handleCloseConnection(connection);
    throw err;
  }
};
