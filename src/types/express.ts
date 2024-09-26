import { Request as ExpressRequest, Response, NextFunction } from 'express';
import { RedisClientType } from 'redis';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import ExampleStyleEnum from '../shared/constants/ExampleStyleEnum';
import { Developer } from './developer';

export type StripeBody = {
  email?: string,
  password?: string,
  name?: string,
  lookupKey?: string,
  developerId?: string,
};

export type Query = {
  dialects: string,
  examples: string,
  style: ExampleStyleEnum,
  filter: string,
  keyword: string,
  page: string,
  range: string,
  resolve: string,
  strict: string,
  tags: string,
  wordClasses: string,
  apiLimit: string,
};

export interface IgboAPIRequest extends ExpressRequest {
  query: Partial<Query>;
  isUsingMainKey?: boolean;
  redisClient?: RedisClientType;
  headers: ExpressRequest['headers'];
  user?: DecodedIdToken;
  developer?: Developer;
  params: { [key: string]: string };
  body: ExpressRequest['body'] & StripeBody;
}

export interface MiddleWare {
  (req: IgboAPIRequest, res: Response, next: NextFunction): void;
}

export interface ErrorMiddleWare {
  (error: Error, req: IgboAPIRequest, res: Response, next: NextFunction): void;
}