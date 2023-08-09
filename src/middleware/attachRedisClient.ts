import { createClient, RedisClientType } from 'redis';
import { NextFunction, Request, Response } from 'express';
import { REDIS_HOST, REDIS_PORT, REDIS_URL, REDIS_USERNAME, REDIS_PASSWORD } from '../config';

interface RedisClientRequest extends Request {
  redisClient: RedisClientType;
}

const afterResponse = (redisClient: RedisClientType) => {
  try {
    if (redisClient) {
      redisClient.quit();
    }
  } catch (err: any) {
    console.log(`Error with closing redis: ${err.message}`);
  }
};

// Keep the same Redis Client connection open
const redisClient =
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
        connect: () => console.log('Connected to fake Redis client'),
        isFake: true,
        isReady: true,
      };

export default async (req: RedisClientRequest, res: Response, next: NextFunction) => {
  if (!redisClient.isReady) {
    redisClient.connect();
  }
  redisClient.on('error', (err) => console.log('Redis Client Error', err));

  res.on('finish', afterResponse);
  res.on('close', afterResponse);

  req.redisClient = redisClient as RedisClientType;
  return next();
};
