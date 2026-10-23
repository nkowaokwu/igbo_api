import { createClient, RedisClientType } from 'redis';
import { REDIS_HOST, REDIS_PORT, REDIS_URL, REDIS_USERNAME, REDIS_PASSWORD } from '../config';
import { MiddleWare } from '../types';

// Keep the same Redis Client connection open
export const redisClient =
  REDIS_HOST && REDIS_PORT && REDIS_USERNAME && REDIS_PASSWORD
    ? createClient({
        socket: {
          host: REDIS_HOST,
          port: REDIS_PORT,
        },
        username: REDIS_USERNAME,
        password: REDIS_PASSWORD,
      })
    : REDIS_URL && process.env.FIREBASE_FUNCTIONS
      ? createClient({
          url: 'redis://localhost:6379',
        })
      : {
          set: () => null,
          get: () => null,
          on: () => console.log('\nFake Redis client'),
          connect: async () => console.log('Connected to fake Redis client'),
          isFake: true,
          isOpen: true,
          isReady: true,
        };

redisClient.on('error', (err: any) => console.log('Redis Client Error', err));

const attachRedisClient: MiddleWare = async (req, res, next) => {
  if (!redisClient.isOpen) {
    redisClient.connect().catch((err: any) => console.log('Redis Client Connection Error', err));
  }

  req.redisClient = redisClient as RedisClientType;
  return next();
};

export default attachRedisClient;
