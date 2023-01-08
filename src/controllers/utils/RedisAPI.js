import { REDIS_CACHE_EXPIRATION } from '../../config';

export const getCachedWords = async ({ redisClient, redisWordsCacheKey }) => {
  const rawCachedWords = await redisClient.get(redisWordsCacheKey);
  const cachedWords = typeof rawCachedWords === 'string' ? JSON.parse(rawCachedWords) : rawCachedWords;
  console.log(`Length of cachedWords for ${redisWordsCacheKey}:`, cachedWords?.length);
  return cachedWords;
};

export const setCachedWords = async ({
  redisClient,
  redisWordsCacheKey,
  words,
  contentLength,
}) => {
  redisClient.set(redisWordsCacheKey, JSON.stringify({ words, contentLength }), 'EX', REDIS_CACHE_EXPIRATION);
};

export const getCachedExamples = async ({ redisClient, redisExamplesCacheKey }) => {
  const rawCachedExamples = await redisClient.get(redisExamplesCacheKey);
  const cachedExamples = typeof rawCachedExamples === 'string' ? JSON.parse(rawCachedExamples) : rawCachedExamples;
  console.log(`Length of cachedExamples ${redisExamplesCacheKey}:`, cachedExamples?.length);
  return cachedExamples;
};

export const setCachedExamples = async ({
  redisClient,
  redisExamplesCacheKey,
  examples,
  contentLength,
}) => {
  await redisClient.set(
    redisExamplesCacheKey,
    JSON.stringify({ examples, contentLength }),
    'EX',
    REDIS_CACHE_EXPIRATION,
  );
};

export const getCachedAllVerbsAndSuffixes = async ({ redisClient, redisAllVerbsAndSuffixesKey }) => {
  const rawCachedAllVerbsAndSuffixes = await redisClient.get(redisAllVerbsAndSuffixesKey);
  const cachedAllVerbsAndSuffixes = typeof rawCachedAllVerbsAndSuffixes === 'string'
    ? JSON.parse(rawCachedAllVerbsAndSuffixes)
    : rawCachedAllVerbsAndSuffixes;
  console.log('Length of cachedAllVerbsAndSuffixes:', cachedAllVerbsAndSuffixes?.length);
  return cachedAllVerbsAndSuffixes;
};

export const setCachedAllVerbsAndSuffixes = async ({
  redisClient,
  redisAllVerbsAndSuffixesKey,
  allVerbsAndSuffixes,
}) => {
  redisClient.set(
    redisAllVerbsAndSuffixesKey,
    `${JSON.stringify(allVerbsAndSuffixes)}`,
    'EX',
    REDIS_CACHE_EXPIRATION,
  );
};
