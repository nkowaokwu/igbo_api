import { createClient } from 'redis';
import { REDIS_URL } from '../config';

const redisClient = REDIS_URL ? createClient({ url: REDIS_URL }) : {
  set: () => null,
  get: () => null,
  on: () => console.log('Fake Redis client'),
  connect: () => console.log('Connected to fake Redis client'),
};
redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect();

export default redisClient;
