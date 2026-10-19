import { Router } from 'express';
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
import rateLimiter from '../middleware/rateLimiter';
import developerAuthorization from '../middleware/developerAuthorization';
import testRouter from './testRouter';

const router = Router();

// Google Analytics
router.use(analytics);

// Rate limiting; trusted IPs bypass via RATE_LIMIT_ALLOWED_IPS
router.use(rateLimiter);

router.get('/words', validateApiKey, attachRedisClient, getWords);
router.get('/words/:id', validateApiKey, validId, attachRedisClient, getWord);
router.get('/examples', validateApiKey, attachRedisClient, getExamples);
router.get('/examples/:id', validateApiKey, validId, attachRedisClient, getExample);

router.get('/developers/:id', developerAuthorization, getDeveloper);
router.post('/developers', validateDeveloperBody, postDeveloper);
router.put('/developers', validateUpdateDeveloperBody, putDeveloper);

router.get('/stats', validateAdminApiKey, attachRedisClient, getStats);

/* Grabs data from JSON dictionary */
if (process.env.NODE_ENV !== 'production') {
  router.use('/test', testRouter);
}

export default router;
