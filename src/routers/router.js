import express from 'express';
import rateLimit from 'express-rate-limit';
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
import flowRequest from '../shared/utils/flowRequest';

const router = express.Router();

const FIFTEEN_MINUTES = 15 * 60 * 1000;
const REQUESTS_PER_MS = 20;
const createDeveloperLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  max: REQUESTS_PER_MS,
});

// Google Analytics
router.use(analytics);

router.get('/words', ...flowRequest([validateApiKey, attachRedisClient, getWords]));
router.get('/words/:id', ...flowRequest([validateApiKey, validId, attachRedisClient, getWord]));
router.get('/examples', ...flowRequest([validateApiKey, attachRedisClient, getExamples]));
router.get('/examples/:id', ...flowRequest([validateApiKey, validId, attachRedisClient, getExample]));

router.post('/developers', ...flowRequest([createDeveloperLimiter, validateDeveloperBody, postDeveloper]));

router.get('/stats', ...flowRequest([validateAdminApiKey, attachRedisClient, getStats]));

export default router;
