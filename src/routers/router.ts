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

router.use(analytics, rateLimiter);

router.get('/words', validateApiKey, attachRedisClient, getWords);
router.get('/words/:id', validateApiKey, validId, attachRedisClient, getWord);
router.get('/examples', validateApiKey, attachRedisClient, getExamples);
router.get('/examples/:id', validateApiKey, validId, attachRedisClient, getExample);

router.post('/developers', validateDeveloperBody, postDeveloper);

router.get('/stats', rateLimiter, validateAdminApiKey, attachRedisClient, getStats);

export default router;
