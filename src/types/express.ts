import { Request as ExpressRequest, Response, NextFunction } from 'express';
import { RedisClientType } from 'redis';

export type Query = {
  dialects: string;
  examples: string;
  filter: string;
  keyword: string;
  page: string;
  range: string;
  resolve: string;
  strict: string;
  tags: string;
  wordClasses: string;
};

export type IgboAPIRequest = ExpressRequest & {
  isUsingMainKey: boolean;
  query: Partial<Query>;
  redisClient: RedisClientType;
};

export type MiddleWare = (req: IgboAPIRequest, res: Response, next: NextFunction) => void;
