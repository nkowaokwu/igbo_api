import express from 'express';
import { getWords, getWord } from '../controllers/words';
import { getExample, getExamples } from '../controllers/examples';
import validId from '../middleware/validId';
import validateApiKey from '../middleware/validateApiKey';
import analytics from '../middleware/analytics';
import attachRedisClient from '../middleware/attachRedisClient';
import { rateLimiter } from '../middleware/rateLimiter';

const routerV2 = express.Router();

routerV2.get('/words', rateLimiter, analytics, validateApiKey, attachRedisClient, getWords);
routerV2.get('/words/:id', rateLimiter, analytics, validateApiKey, validId, attachRedisClient, getWord);
routerV2.get('/examples', rateLimiter, analytics, validateApiKey, attachRedisClient, getExamples);
routerV2.get('/examples/:id', rateLimiter, analytics, validateApiKey, validId, attachRedisClient, getExample);

// Redirects to V1
routerV2.post('/developers', (_, res) => res.redirect('/api/v1/developers'));
routerV2.get('/stats', (_, res) => res.redirect('/api/v1/stats'));

export default routerV2;
