import { createClient } from 'redis';
import { REDIS_HOST, REDIS_PORT } from '../config';

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
  const redisClient = REDIS_HOST && REDIS_PORT ? createClient({
    url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
  }) : {
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
