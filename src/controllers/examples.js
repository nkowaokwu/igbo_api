import { exampleSchema } from '../models/Example';
import { packageResponse, handleQueries } from './utils';
import { searchExamplesRegexQuery } from './utils/queries';
import { findExamplesWithMatch } from './utils/buildDocs';
import { createDbConnection, handleCloseConnection } from '../services/database';
import { getCachedExamples, setCachedExamples } from '../APIs/RedisAPI';

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
    const { examples: allExamples, contentLength } = findExamplesWithMatch({ match: query, version });
    await setCachedExamples({ key: redisExamplesCacheKey, data: { allExamples, contentLength }, redisClient });

    responseData = {
      examples: allExamples,
      contentLength,
    };
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
