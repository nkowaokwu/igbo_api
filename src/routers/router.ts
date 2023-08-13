import express from 'express';
import { Express } from '../types';
import { getWords, getWord } from '../controllers/words';
import { getExamples, getExample } from '../controllers/examples';
import { postDeveloper } from '../controllers/developers';
import { getStats } from '../controllers/stats';
import validId from '../middleware/validId';
import validateDeveloperBody from '../middleware/validateDeveloperBody';
import validateApiKey from '../middleware/validateApiKey';
import validateAdminApiKey from '../middleware/validateAdminApiKey';
import attachRedisClient from '../middleware/attachRedisClient';
import analytics from '../middleware/analytics';
import { rateLimiter } from '../middleware/rateLimiter';

const router = express.Router();

// Google Analytics
router.use(analytics);

router.get('/words', rateLimiter, validateApiKey, attachRedisClient, getWords);
router.get('/words/:id', rateLimiter, validateApiKey, validId, attachRedisClient, getWord);
router.get('/examples', rateLimiter, validateApiKey, attachRedisClient, getExamples);
router.get('/examples/:id', rateLimiter, validateApiKey, validId, attachRedisClient, getExample);

router.post('/developers', rateLimiter, validateDeveloperBody, postDeveloper);

router.get('/stats', rateLimiter, validateAdminApiKey, attachRedisClient, getStats);

export default router;
