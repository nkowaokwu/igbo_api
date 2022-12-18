import redisClient from '../services/redis';

export default async (req, res, next) => {
  req.redisClient = redisClient;
  return next();
};
