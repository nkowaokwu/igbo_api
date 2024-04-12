import express from 'express';
import rateLimit from 'express-rate-limit';
import { MiddleWare } from '../types';
import { getWords, getWord } from '../controllers/words';
import { getExamples, getExample } from '../controllers/examples';
import { getDeveloper, postDeveloper, putDeveloper } from '../controllers/developers';
import { getStats } from '../controllers/stats';
import validId from '../middleware/validId';
import validateDeveloperBody from '../middleware/validateDeveloperBody';
import validateUpdateDeveloperBody from '../middleware/validateUpdateDeveloperBody';
import validateApiKey from '../middleware/validateApiKey';
import validateAdminApiKey from '../middleware/validateAdminApiKey';
import attachRedisClient from '../middleware/attachRedisClient';
import analytics from '../middleware/analytics';
import developerAuthorization from '../middleware/developerAuthorization';

const router = express.Router();

const FIFTEEN_MINUTES = 15 * 60 * 1000;
const REQUESTS_PER_MS = 20;
const developerRateLimiter: MiddleWare = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  max: REQUESTS_PER_MS,
});

// Google Analytics
router.use(analytics);

router.get('/words', validateApiKey, attachRedisClient, getWords);
router.get('/words/:id', validateApiKey, validId, attachRedisClient, getWord);
router.get('/examples', validateApiKey, attachRedisClient, getExamples);
router.get('/examples/:id', validateApiKey, validId, attachRedisClient, getExample);

router.get('/developers/:id', developerAuthorization, getDeveloper);
router.post('/developers', developerRateLimiter, validateDeveloperBody, postDeveloper);
router.put('/developers', developerRateLimiter, validateUpdateDeveloperBody, putDeveloper);

router.get('/stats', validateAdminApiKey, attachRedisClient, getStats);

export default router;
