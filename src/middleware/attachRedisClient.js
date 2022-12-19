import { createClient } from 'redis';
import { REDIS_URL } from '../config';

export default async (req, res, next) => {
  const redisClient = REDIS_URL ? createClient({ url: REDIS_URL }) : {
    set: () => null,
    get: () => null,
    on: () => console.log('\nFake Redis client'),
    connect: () => console.log('Connected to fake Redis client'),
    isFake: true,
  };
  redisClient.on('error', (err) => console.log('Redis Client Error', err));
  redisClient.connect();

  req.redisClient = redisClient;
  return next();
};
