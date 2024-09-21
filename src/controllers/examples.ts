import { assign, omit } from 'lodash';
import { Connection, PipelineStage } from 'mongoose';
import { RedisClientType } from 'redis';
import { exampleSchema } from '../models/Example';
import { packageResponse, handleQueries } from './utils';
import { searchExamplesRegexQuery } from './utils/queries';
import { findExamplesWithMatch } from './utils/buildDocs';
import { createDbConnection, handleCloseConnection } from '../services/database';
import { getCachedExamples, setCachedExamples } from '../APIs/RedisAPI';
import { Example as ExampleType, MiddleWare } from '../types';
import Version from '../shared/constants/Version';
import { ExampleResponseData, ExampleWithPronunciation } from './types';

/* Converts the pronunciations field to pronunciation for v1 */
export const convertExamplePronunciations = (example: ExampleType): ExampleWithPronunciation => {
  const updatedExample = assign(example);
  const exampleWithPronunciation = {
    ...omit(updatedExample, ['pronunciations']),
    pronunciation: updatedExample.pronunciations?.[0]?.audio || '',
  };
  return exampleWithPronunciation;
};

/* Create a new Example object in MongoDB */
export const createExample = async (data: ExampleType, connection: Connection) => {
  const Example = connection.model('Example', exampleSchema);
  const example = new Example(data);
  return example.save();
};

type SearchExamplesArg = {
  limit: number,
  query: PipelineStage.Match['$match'],
  redisClient: RedisClientType | undefined,
  searchWord: string,
  skip: number,
  version: Version,
};
/* Uses regex to search for examples with both Igbo and English */
const searchExamples = async ({
  redisClient,
  searchWord,
  query,
  version,
  skip,
  limit,
}: SearchExamplesArg) => {
  let responseData: ExampleResponseData = { contentLength: 0, examples: [] };
  const redisExamplesCacheKey = `example-${searchWord}-${version}`;
  const cachedExamples = await getCachedExamples({ key: redisExamplesCacheKey, redisClient });
  if (cachedExamples) {
    responseData = {
      examples: cachedExamples.examples,
      contentLength: cachedExamples.contentLength,
    };
  } else {
    const { examples, contentLength } = await findExamplesWithMatch({
      match: query,
      version,
    });

    responseData = await setCachedExamples({
      key: redisExamplesCacheKey,
      data: {
        examples,
        contentLength,
      },
      redisClient,
    });
  }
  const examples = responseData.examples.slice(skip, skip + limit);
  return { examples, contentLength: responseData.contentLength };
};

/* Returns examples from MongoDB */
export const getExamples: MiddleWare = async (req, res, next) => {
  try {
    const { version, searchWord, regex, skip, limit, redisClient, isUsingMainKey, flags, ...rest } =
      await handleQueries(req);
    const regexMatch =
      !isUsingMainKey && !searchWord
        ? {
            source: { $exists: false },
          }
        : searchExamplesRegexQuery({ regex, flags });
    const responseData = await searchExamples({
      searchWord,
      redisClient,
      query: regexMatch,
      version,
      skip,
      limit,
    });

    return packageResponse({
      res,
      docs: responseData.examples,
      contentLength: responseData.contentLength,
      version,
      ...rest,
    });
  } catch (err: any) {
    return next(err);
  }
};

const findExampleById = async (id: string) => {
  const connection = createDbConnection();
  const Example = connection.model<ExampleType>('Example', exampleSchema);
  try {
    const example = await Example.findById(id);
    await handleCloseConnection(connection);
    return example;
  } catch (err: any) {
    await handleCloseConnection(connection);
    throw err;
  }
};

/* Returns an example from MongoDB using an id */
export const getExample: MiddleWare = async (req, res, next) => {
  try {
    const { id, version } = await handleQueries(req);
    const foundExample = await findExampleById(id).then((example) => {
      if (!example) {
        throw new Error('No example exists with the provided id.');
      }
      if (version === Version.VERSION_1) {
        return convertExamplePronunciations(example.toJSON());
      }
      return example;
    });
    return packageResponse({
      res,
      docs: foundExample,
      contentLength: 1,
      version,
    });
  } catch (err: any) {
    return next(err);
  }
};
