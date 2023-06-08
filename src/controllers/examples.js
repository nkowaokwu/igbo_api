import { assign, omit } from 'lodash';
import { exampleSchema } from '../models/Example';
import { packageResponse, handleQueries } from './utils';
import { searchExamplesRegexQuery } from './utils/queries';
import { findExamplesWithMatch } from './utils/buildDocs';
import { createDbConnection, handleCloseConnection } from '../services/database';
import { getCachedExamples, setCachedExamples } from '../APIs/RedisAPI';
import Version from '../shared/constants/Version';

/* Converts the pronunciations field to pronunciation for v1 */
export const convertExamplePronunciations = (example) => {
  let updatedExample = assign(example);
  updatedExample.pronunciation = updatedExample.pronunciations?.[0]?.audio || '';
  updatedExample = omit(updatedExample, ['pronunciations']);
  return updatedExample;
};

/* Create a new Example object in MongoDB */
export const createExample = async (data, connection) => {
  const Example = connection.model('Example', exampleSchema);
  const example = new Example(data);
  return example.save();
};

/* Uses regex to search for examples with both Igbo and English */
const searchExamples = async ({
  redisClient,
  searchWord,
  query,
  version,
  skip,
  limit,
}) => {
  let responseData = {};
  const redisExamplesCacheKey = `example-${searchWord}-${version}`;
  const cachedExamples = await getCachedExamples({ key: redisExamplesCacheKey, redisClient });
  if (cachedExamples) {
    responseData = {
      examples: cachedExamples.examples,
      contentLength: cachedExamples.contentLength,
    };
  } else {
    const { examples, contentLength } = await findExamplesWithMatch({ match: query, version });
    let allExamples = examples;

    // Replaces pronunciations with pronunciation v1
    if (version === Version.VERSION_1) {
      allExamples = allExamples.map((example) => convertExamplePronunciations(example));
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
export const getExamples = async (req, res, next) => {
  try {
    const {
      version,
      searchWord,
      keywords,
      regex,
      skip,
      limit,
      redisClient,
      isUsingMainKey,
      ...rest
    } = await handleQueries(req);
    const regexMatch = !isUsingMainKey && !searchWord ? ({
      igbo: { $exists: false },
    }) : searchExamplesRegexQuery(regex);
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

const findExampleById = async (id) => {
  const connection = createDbConnection();
  const Example = connection.model('Example', exampleSchema);
  try {
    const example = await Example.findById(id);
    await handleCloseConnection(connection);
    return example;
  } catch (err) {
    await handleCloseConnection(connection);
    throw err;
  }
};

/* Returns an example from MongoDB using an id */
export const getExample = async (req, res, next) => {
  try {
    const { id, version } = await handleQueries(req);
    const foundExample = await findExampleById(id)
      .then((example) => {
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
  } catch (err) {
    return next(err);
  }
};
