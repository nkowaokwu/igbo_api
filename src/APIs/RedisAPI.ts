import assign from 'lodash/assign';
import { RedisClientType } from 'redis';
import { REDIS_CACHE_EXPIRATION } from '../config';
import minimizeWords from '../controllers/utils/minimizeWords';
import Version from '../shared/constants/Version';
import Word from '../models/interfaces/Word';

export const getCachedWords = async ({ key, redisClient }: { key: string; redisClient: RedisClient }) => {
  console.time('Getting cached words');
  const rawCachedWords = await redisClient.get(key);
  const cachedWords = typeof rawCachedWords === 'string' ? JSON.parse(rawCachedWords) : rawCachedWords;
  console.log(`Retrieved cached data for words ${key}:`, !!cachedWords);
  console.timeEnd('Getting cached words');
  return cachedWords;
};

type RedisClient = RedisClientType & { isFake?: boolean };

export const setCachedWords = async ({
  key,
  data,
  redisClient,
  version,
}: {
  key: string;
  data: { words: Word[]; contentLength: number };
  redisClient: RedisClient;
  version: Version;
}) => {
  const updatedData = assign(data);
  updatedData.words = minimizeWords(data.words, version);
  if (!redisClient.isFake) {
    await redisClient.set(key, JSON.stringify(updatedData), { EX: REDIS_CACHE_EXPIRATION });
  }
  return updatedData;
};

export const getCachedExamples = async ({ key, redisClient }: { key: string; redisClient: RedisClient }) => {
  const rawCachedExamples = await redisClient.get(key);
  const cachedExamples = typeof rawCachedExamples === 'string' ? JSON.parse(rawCachedExamples) : rawCachedExamples;
  console.log(`Retrieved cached data for examples ${key}:`, !!cachedExamples);
  return cachedExamples;
};

export const setCachedExamples = async ({
  key,
  data,
  redisClient,
}: {
  key: string;
  data: object;
  redisClient: RedisClient;
}) => {
  if (!redisClient.isFake) {
    await redisClient.set(key, JSON.stringify(data), { EX: REDIS_CACHE_EXPIRATION });
  }
  return data;
};

export const getAllCachedVerbsAndSuffixes = async ({ key, redisClient }: { key: string; redisClient: RedisClient }) => {
  const redisAllVerbsAndSuffixesKey = `verbs-and-suffixes-${key}`;
  const rawCachedAllVerbsAndSuffixes = await redisClient.get(redisAllVerbsAndSuffixesKey);
  const cachedAllVerbsAndSuffixes =
    typeof rawCachedAllVerbsAndSuffixes === 'string'
      ? JSON.parse(rawCachedAllVerbsAndSuffixes)
      : rawCachedAllVerbsAndSuffixes;
  return cachedAllVerbsAndSuffixes;
};

export const setAllCachedVerbsAndSuffixes = async ({
  key,
  data,
  redisClient,
  version,
}: {
  key: string;
  data: object;
  redisClient: RedisClient;
  version: Version;
}) => {
  const redisAllVerbsAndSuffixesKey = `verbs-and-suffixes-${key}`;
  const updatedData = minimizeWords(data, version);
  if (!redisClient.isFake) {
    await redisClient.set(redisAllVerbsAndSuffixesKey, JSON.stringify(updatedData), { EX: REDIS_CACHE_EXPIRATION });
  }
  return updatedData;
};
