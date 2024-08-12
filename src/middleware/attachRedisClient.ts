import { RedisClientType } from 'redis';
// import { REDIS_HOST, REDIS_PORT, REDIS_URL, REDIS_USERNAME, REDIS_PASSWORD } from '../config';
import { MiddleWare } from '../types';

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
export const redisClient = {
  set: () => null,
  get: () => null,
  on: () => console.log('\nFake Redis client'),
  connect: () => console.log('Connected to fake Redis client'),
  isFake: true,
  isReady: true,
};
// REDIS_HOST && REDIS_PORT && REDIS_USERNAME && REDIS_PASSWORD
//   ? createClient({
//       socket: {
//         host: REDIS_HOST,
//         port: REDIS_PORT,
//       },
//       username: REDIS_USERNAME,
//       password: REDIS_PASSWORD,
//     })
//   : REDIS_URL && process.env.FIREBASE_FUNCTIONS
//     ? createClient({
//         url: 'redis://localhost:6379',
//       })
//     : {
//         set: () => null,
//         get: () => null,
//         on: () => console.log('\nFake Redis client'),
//         connect: () => console.log('Connected to fake Redis client'),
//         isFake: true,
//         isReady: true,
//       };

const attachRedisClient: MiddleWare = async (req, res, next) => {
  if (!redisClient.isReady) {
    redisClient.connect();
  }
  // @ts-expect-error redisClient
  redisClient.on('error', (err: any) => console.log('Redis Client Error', err));

  res.on('finish', afterResponse);
  res.on('close', afterResponse);

  // @ts-expect-error redisClient
  req.redisClient = redisClient as RedisClientType;
  return next();
};

export default attachRedisClient;
