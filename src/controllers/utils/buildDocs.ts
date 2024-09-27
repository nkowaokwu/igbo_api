import { Aggregate, Model as ModelType, PipelineStage } from 'mongoose';
import { assign, flatten, flow, omit } from 'lodash';
import Version from '../../shared/constants/Version';
import { wordSchema } from '../../models/Word';
import { exampleSchema } from '../../models/Example';
import Dialects from '../../shared/constants/Dialect';
import { createDbConnection, handleCloseConnection } from '../../services/database';
import WordAttributeEnum from '../../shared/constants/WordAttributeEnum';
import {
  IncomingExample,
  NsibidiCharacter as NsibidiCharacterType,
  OutgoingExample,
  OutgoingWord,
  OutgoingLegacyWord,
} from '../../types';
import { nsibidiCharacterSchema } from '../../models/NsibidiCharacter';

type NestedDoc = { _id?: string, __v?: number };

/**
 * Removes _id and __v from nested documents
 * Normalizes (removes accent marks) from word and example's igbo
 */
const removeKeysInNestedDoc = <T>(docs: T[], nestedDocsKey: keyof T) => {
  docs.forEach((doc: T) => {
    const updatedDoc = assign(doc);
    // @ts-expect-error not assignable to never
    updatedDoc[nestedDocsKey] = ((doc[nestedDocsKey] as NestedDoc[]) || []).map(
      (nestedDoc: NestedDoc) => {
        const updatedNestedDoc = assign(nestedDoc, { id: nestedDoc._id });
        delete updatedNestedDoc._id;
        delete updatedNestedDoc.__v;
        return updatedNestedDoc;
      }
    );
    return updatedDoc;
  });
  return docs;
};

const cleanExamples = ({ examples, version }: { examples: IncomingExample[], version: Version }) =>
  examples.map((example) => {
    const cleanedExample: Omit<IncomingExample, 'source' | 'translations'> & {
      igbo: string,
      english: string,
      pronunciation?: string,
      pronunciations?: string[],
    } = omit(
      assign({
        ...example,
        igbo: '',
        english: '',
      }),
      ['source', 'translations']
    );
    if (version === Version.VERSION_1) {
      cleanedExample.pronunciation = example.source.pronunciations?.[0]?.audio || '';
    } else {
      cleanedExample.pronunciations = example.source.pronunciations.map(({ audio }) => audio);
    }

    // To prevent v1 an v2, source and translations will be converted back to igbo and english
    cleanedExample.igbo = example.source.text;
    cleanedExample.english = example.translations[0]?.text;
    return cleanedExample;
  });

/**
 * Creates foundation for Word aggregation pipeline
 * @param {*} match
 * @returns Word aggregation pipeline
 */
const generateAggregationBase = <T>(
  Model: ModelType<T>,
  match: PipelineStage.Match['$match']
): Aggregate<T[]> => Model.aggregate<T>().match(match);

/* Performs a outer left lookup to append associated examples
 * and returns a plain word object, not a Mongoose Query
 */
export const findWordsWithMatch = async ({
  match,
  version,
  lean = false,
}: {
  match: PipelineStage.Match['$match'],
  version: Version,
  lean?: boolean,
  queryLabel?: string,
}) => {
  const connection = createDbConnection();
  const Word = connection.model<OutgoingWord>('Word', wordSchema);
  try {
    let words = generateAggregationBase<OutgoingWord>(Word, match);

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

    const cleanedWords = removeKeysInNestedDoc<OutgoingWord>(await words, 'examples').map(
      (word) => {
        const updatedWord = assign(word);
        // @ts-expect-error different versions
        updatedWord.examples = cleanExamples({ examples: updatedWord.examples, version });
        return updatedWord;
      }
    );
    const contentLength = cleanedWords.length;

    const finalWords = cleanedWords.map((cleanedWord: OutgoingWord) => {
      if (version === Version.VERSION_1) {
        const word: OutgoingLegacyWord = assign(omit(cleanedWord, ['tags', 'dialects']), {
          wordClass: '',
          nsibidi: '',
          definitions: [],
          dialects: {},
        });
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
        return word;
      }
      return cleanedWord;
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
  match: Record<string, RegExp | object>,
  version: Version,
}): Promise<{ examples: OutgoingExample[], contentLength: number }> => {
  const connection = createDbConnection();
  const Example = connection.model<IncomingExample>('Example', exampleSchema);
  try {
    let examples = generateAggregationBase<IncomingExample>(Example, match);

    examples = examples.project({
      id: '$_id',
      _id: 0,
      source: 1,
      translations: 1,
      meaning: 1,
      style: 1,
      associatedWords: 1,
      ...(version === Version.VERSION_2 ? { associatedDefinitionsSchemas: 1 } : {}),
      pronunciations: 1,
    });

    // Returns only the first pronunciation for the example sentence
    const allExamples = cleanExamples({ examples: await examples, version });
    const contentLength = allExamples.length;

    await handleCloseConnection(connection);
    // @ts-expect-error incorrect example types
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
  match: Record<string, RegExp | object>,
  version: Version,
}): Promise<{ nsibidiCharacters: NsibidiCharacterType[], contentLength: number }> => {
  const connection = createDbConnection();
  const NsibidiCharacter = connection.model<NsibidiCharacterType>(
    'NsibidiCharacter',
    nsibidiCharacterSchema
  );

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
