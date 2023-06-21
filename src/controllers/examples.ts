import { NextFunction, Response } from 'express';
import { assign } from 'lodash';
import { Connection } from 'mongoose';
import { getCachedExamples, setCachedExamples } from '../APIs/RedisAPI';
import { exampleSchema } from '../models/Example';
import Example from '../models/interfaces/Example';
import { createDbConnection, handleCloseConnection } from '../services/database';
import Version from '../shared/constants/Version';
import { ExampleResponse } from './controllers.interface';
import { IgboAPIRequest, handleQueries, packageResponse } from './utils';
import { findExamplesWithMatch } from './utils/buildDocs';
import { searchExamplesRegexQuery } from './utils/queries';

/* Converts the pronunciations field to pronunciation for v1 */
export const convertExamplePronunciations = (example: Example & { pronunciation?: string }) => {
  const updatedExample = assign(example);
  updatedExample.pronunciation = updatedExample.pronunciations?.[0]?.audio || '';
  delete updatedExample.pronunciations;
  return updatedExample;
};

/* Create a new Example object in MongoDB */
export const createExample = async (data: Example, connection: Connection) => {
  const ExampleConnection = connection.model('Example', exampleSchema);
  const example = new ExampleConnection(data);
  return example.save();
};

/* Uses regex to search for examples with both Igbo and English */
const searchExamples = async ({ redisClient, searchWord, query, version, skip, limit }) => {
  let responseData: ExampleResponse = {};

  const redisExamplesCacheKey = `example-${searchWord}-${version}`;
  const cachedExamples = await getCachedExamples({ key: redisExamplesCacheKey, redisClient });

  if (cachedExamples) {
    responseData = {
      examples: cachedExamples.examples,
      contentLength: cachedExamples.contentLength,
    };
  } else {
    const { examples, contentLength }: ExampleResponse = await findExamplesWithMatch({
      match: query,
      version,
    });

    let allExamples: Example[] = [];
    // Replaces pronunciations with pronunciation v1
    if (version === Version.VERSION_1) {
      allExamples = examples.map((example) => convertExamplePronunciations(example));
    }

    responseData = await setCachedExamples({
      key: redisExamplesCacheKey,
      data: { examples: allExamples, contentLength },
      redisClient,
    });
  }
  const examples = responseData.examples.slice(skip, skip + limit);
  return { examples, contentLength: responseData.contentLength };
};

/* Returns examples from MongoDB */
export const getExamples = async (req: IgboAPIRequest, res: Response, next: NextFunction) => {
  try {
    const { version, searchWord, regex, skip, limit, redisClient, isUsingMainKey, ...rest } = await handleQueries(req);
    const regexMatch =
      !isUsingMainKey && !searchWord
        ? {
            igbo: { $exists: false },
          }
        : searchExamplesRegexQuery(regex);
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
  } catch (err) {
    return next(err);
  }
};

const findExampleById = async (id: string) => {
  const connection = createDbConnection();
  const ExampleConnection = connection.model('Example', exampleSchema);
  try {
    const example = await ExampleConnection.findById(id);
    await handleCloseConnection(connection);
    return example;
  } catch (err) {
    await handleCloseConnection(connection);
    throw err;
  }
};

/* Returns an example from MongoDB using an id */
export const getExample = async (req: IgboAPIRequest, res: Response, next: NextFunction) => {
  try {
    const { id, version } = await handleQueries(req);
    const foundExample = await findExampleById(id);

    if (!foundExample) {
      throw new Error('No example exists with the provided id.');
    }
    if (version === Version.VERSION_1) {
      return convertExamplePronunciations(foundExample.toJSON());
    }

    return packageResponse({
      res,
      docs: foundExample,
      contentLength: 1,
      version,
    });
  } catch (err) {
    return next(err);
  }
};
