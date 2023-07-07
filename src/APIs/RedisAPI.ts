import assign from 'lodash/assign';
import { REDIS_CACHE_EXPIRATION } from '../config';
import minimizeWords from '../controllers/utils/minimizeWords';

interface GetCachedWordsParams {
  key: string;
  redisClient: RedisClient;
}

export const getCachedWords = async ({ key, redisClient }: GetCachedWordsParams) => {
  console.time('Getting cached words');
  const rawCachedWords = await redisClient.get(key);
  const cachedWords = typeof rawCachedWords === 'string' ? JSON.parse(rawCachedWords) : rawCachedWords;
  console.log(`Retrieved cached data for words ${key}:`, !!cachedWords);
  console.timeEnd('Getting cached words');
  return cachedWords;
};

interface SetCachedWordsParams {
  key: string;
  data: any; // Update the type of `data` accordingly
  redisClient: RedisClient;
  version: string; // Update the type of `version` accordingly
}

export const setCachedWords = async ({ key, data, redisClient, version }: SetCachedWordsParams) => {
  const updatedData = assign({}, data);
  updatedData.words = minimizeWords(data.words, version);
  if (!redisClient.isFake) {
    await redisClient.set(key, JSON.stringify(updatedData), { EX: REDIS_CACHE_EXPIRATION });
  }
  return updatedData;
};

interface GetCachedExamplesParams {
  key: string;
  redisClient: RedisClient;
}

export const getCachedExamples = async ({ key, redisClient }: GetCachedExamplesParams) => {
  const rawCachedExamples = await redisClient.get(key);
  const cachedExamples = typeof rawCachedExamples === 'string' ? JSON.parse(rawCachedExamples) : rawCachedExamples;
  console.log(`Retrieved cached data for examples ${key}:`, !!cachedExamples);
  return cachedExamples;
};

interface SetCachedExamplesParams {
  key: string;
  data: any; // Update the type of `data` accordingly
  redisClient: RedisClient;
}

export const setCachedExamples = async ({ key, data, redisClient }: SetCachedExamplesParams) => {
  if (!redisClient.isFake) {
    await redisClient.set(key, JSON.stringify(data), { EX: REDIS_CACHE_EXPIRATION });
  }
  return data;
};

interface GetAllCachedVerbsAndSuffixesParams {
  key: string;
  redisClient: RedisClient;
}

export const getAllCachedVerbsAndSuffixes = async ({ key, redisClient }: GetAllCachedVerbsAndSuffixesParams) => {
  const redisAllVerbsAndSuffixesKey = `verbs-and-suffixes-${key}`;
  const rawCachedAllVerbsAndSuffixes = await redisClient.get(redisAllVerbsAndSuffixesKey);
  const cachedAllVerbsAndSuffixes =
    typeof rawCachedAllVerbsAndSuffixes === 'string'
      ? JSON.parse(rawCachedAllVerbsAndSuffixes)
      : rawCachedAllVerbsAndSuffixes;
  return cachedAllVerbsAndSuffixes;
};

interface SetAllCachedVerbsAndSuffixesParams {
  key: string;
  data: any; // Update the type of `data` accordingly
  redisClient: RedisClient;
  version: string; // Update the type of `version` accordingly
}

export const setAllCachedVerbsAndSuffixes = async ({
  key,
  data,
  redisClient,
  version,
}: SetAllCachedVerbsAndSuffixesParams) => {
  const redisAllVerbsAndSuffixesKey = `verbs-and-suffixes-${key}`;
  const updatedData = minimizeWords(data, version);
  if (!redisClient.isFake) {
    await redisClient.set(redisAllVerbsAndSuffixesKey, JSON.stringify(updatedData), { EX: REDIS_CACHE_EXPIRATION });
  }
  return updatedData;
};
