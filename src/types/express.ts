import { Request as ExpressRequest, Response, NextFunction } from 'express';
import { RedisClientType } from 'redis';
import { DeveloperDocument } from './developer';

export interface Query {
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
  apiLimit: string;
}

export interface IgboAPIRequest extends ExpressRequest {
  query: Partial<Query>;
  isUsingMainKey?: boolean;
  redisClient?: RedisClientType;
  developer?: DeveloperDocument;
}

export interface MiddleWare {
  (req: IgboAPIRequest, res: Response, next: NextFunction): void;
}
