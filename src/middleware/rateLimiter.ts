import rateLimit from 'express-rate-limit';
import { Express } from '../types';

export const rateLimiter: Express.MiddleWare = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes in milliseconds
  max: 20,
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});
