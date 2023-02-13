import { createClient } from 'redis';
import {
  REDIS_HOST,
  REDIS_PORT,
  REDIS_URL,
  REDIS_USERNAME,
  REDIS_PASSWORD,
} from '../config';

const afterResponse = (redisClient) => {
  try {
    if (redisClient) {
      redisClient.quit();
    }
  } catch (err) {
    console.log(`Error with closing redis: ${err.message}`);
  }
};

export default async (req, res, next) => {
  const redisClient = REDIS_HOST && REDIS_PORT && REDIS_USERNAME && REDIS_PASSWORD
    ? createClient({
      url: `redis://${REDIS_USERNAME}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`,
    })
    : REDIS_URL && process.env.FIREBASE_FUNCTIONS
      ? createClient({
        url: 'redis://localhost:6379',
      })
      : {
        set: () => null,
        get: () => null,
        on: () => console.log('\nFake Redis client'),
        connect: () => console.log('Connected to fake Redis client'),
        isFake: true,
      };
  redisClient.on('error', (err) => console.log('Redis Client Error', err));
  redisClient.connect();

  res.on('finish', afterResponse);
  res.on('close', afterResponse);

  req.redisClient = redisClient;
  return next();
};
