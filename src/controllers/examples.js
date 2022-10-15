import Example from '../models/Example';
import { packageResponse, handleQueries } from './utils';
import { searchExamplesRegexQuery } from './utils/queries';
import { REDIS_CACHE_EXPIRATION } from '../config';

/* Create a new Example object in MongoDB */
export const createExample = (data) => {
  const example = new Example(data);
  return example.save();
};

/* Uses regex to search for examples with both Igbo and English */
const searchExamples = ({ query, skip, limit }) => (
  Example
    .find(query)
    .skip(skip)
    .limit(limit)
);

/* Returns examples from MongoDB */
export const getExamples = (redisClient) => async (req, res, next) => {
  try {
    const {
      searchWord,
      regexKeyword,
      skip,
      limit,
      ...rest
    } = handleQueries(req);
    const regexMatch = searchExamplesRegexQuery(regexKeyword);
    const redisCacheKey = `${searchWord}-${skip}-${limit}`;
    const cachedExamples = await redisClient.get(redisCacheKey);
    let examples;
    if (cachedExamples) {
      examples = cachedExamples;
    } else {
      examples = await searchExamples({ query: regexMatch, skip, limit });
      redisClient.set(redisCacheKey, JSON.stringify(examples), 'EX', REDIS_CACHE_EXPIRATION);
    }

    return packageResponse({
      res,
      docs: examples,
      model: Example,
      query: regexMatch,
      ...rest,
    });
  } catch (err) {
    return next(err);
  }
};

export const findExampleById = (id) => (
  Example.findById(id)
);

/* Returns an example from MongoDB using an id */
export const getExample = async (req, res, next) => {
  try {
    const { id } = req.params;
    const foundExample = await findExampleById(id)
      .then((example) => {
        if (!example) {
          throw new Error('No example exists with the provided id.');
        }
        return example;
      });
    return res.send(foundExample);
  } catch (err) {
    return next(err);
  }
};
