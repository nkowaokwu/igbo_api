import assign from 'lodash/assign';
import { REDIS_CACHE_EXPIRATION } from '../config';
import minimizeWords from '../controllers/utils/minimizeWords';
import minimizeVerbsAndSuffixes from '../controllers/utils/minimizeVerbsAndSuffixes';
import Version from '../shared/constants/Version';
import { Word } from '../types';
import { ExampleResponseData } from '../controllers/types';
import { redisClient as defaultRedisClient } from '../middleware/attachRedisClient';

type RedisClient = {
  get: (value: string) => void;
  isFake?: boolean;
  set: (key: string, value: string, options: { [key in string]: any }) => void;
};

type GetValue = {
  key: string;
  redisClient: RedisClient | undefined;
};

export const getCachedWords = async ({ key, redisClient = defaultRedisClient }: GetValue) => {
  console.time('Getting cached words');
  const rawCachedWords = await redisClient.get(key);
  const cachedWords = typeof rawCachedWords === 'string' ? JSON.parse(rawCachedWords) : rawCachedWords;
  console.log(`Retrieved cached data for words ${key}:`, !!cachedWords);
  console.timeEnd('Getting cached words');
  return cachedWords;
};

export const setCachedWords = async ({
  key,
  data,
  redisClient = defaultRedisClient,
  version,
}: {
  key: string;
  data: any;
  redisClient: RedisClient | undefined;
  version: Version;
}) => {
  const updatedData = assign(data);
  updatedData.words = minimizeWords(data.words, version);
  if (!redisClient.isFake) {
    await redisClient.set(key, JSON.stringify(updatedData), { EX: REDIS_CACHE_EXPIRATION });
  }
  return updatedData;
};

export const getCachedExamples = async ({ key, redisClient = defaultRedisClient }: GetValue) => {
  const rawCachedExamples = await redisClient.get(key);
  const cachedExamples = typeof rawCachedExamples === 'string' ? JSON.parse(rawCachedExamples) : rawCachedExamples;
  console.log(`Retrieved cached data for examples ${key}:`, !!cachedExamples);
  return cachedExamples;
};

export const setCachedExamples = async ({
  key,
  data,
  redisClient = defaultRedisClient,
}: {
  key: string;
  data: ExampleResponseData;
  redisClient: RedisClient | undefined;
}) => {
  if (!redisClient.isFake) {
    await redisClient.set(key, JSON.stringify(data), { EX: REDIS_CACHE_EXPIRATION });
  }
  return data;
};

export const getAllCachedVerbsAndSuffixes = async ({ key, redisClient = defaultRedisClient }: GetValue) => {
  console.time(`Searching cached verbs and suffixes: verbs-and-suffixes-${key}`);
  const redisAllVerbsAndSuffixesKey = `verbs-and-suffixes-${key}`;
  const rawCachedAllVerbsAndSuffixes = await redisClient.get(redisAllVerbsAndSuffixesKey);
  const cachedAllVerbsAndSuffixes =
    typeof rawCachedAllVerbsAndSuffixes === 'string'
      ? JSON.parse(rawCachedAllVerbsAndSuffixes)
      : rawCachedAllVerbsAndSuffixes;
  console.log(`Retrieved cached data for verbs and suffixes ${key}:`, !!cachedAllVerbsAndSuffixes);
  console.timeEnd(`Searching cached verbs and suffixes: verbs-and-suffixes-${key}`);
  return cachedAllVerbsAndSuffixes;
};

export const setAllCachedVerbsAndSuffixes = async ({
  key,
  data,
  redisClient = defaultRedisClient,
  version,
}: {
  key: Version;
  data: Word[];
  redisClient: RedisClient | undefined;
  version: Version;
}) => {
  const redisAllVerbsAndSuffixesKey = `verbs-and-suffixes-${key}`;
  const updatedData = minimizeVerbsAndSuffixes(data, version);
  if (!redisClient.isFake) {
    await redisClient.set(redisAllVerbsAndSuffixesKey, JSON.stringify(updatedData), { EX: REDIS_CACHE_EXPIRATION });
  }
  console.log(`Setting verbs and suffixes cache: ${JSON.stringify(updatedData, null, 2).length}`);
  return updatedData;
};
