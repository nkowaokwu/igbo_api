import express from 'express';
import rateLimit from 'express-rate-limit';
import { getWords, getWord, getWordsFilteredByWordClass } from '../controllers/words';
import { getExamples, getExample } from '../controllers/examples';
import { postDeveloper } from '../controllers/developers';
import { APIStats } from '../controllers/stats';
import validId from '../middleware/validId';
import validateDeveloperBody from '../middleware/validateDeveloperBody';
import validateApiKey from '../middleware/validateApiKey';

const router = express.Router();

const FIFTEEN_MINUTES = 15 * 60 * 1000;
const REQUESTS_PER_MS = 20;
const createDeveloperLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  max: REQUESTS_PER_MS,
});

router.get('/words', validateApiKey, getWords);
router.get('/words/wordClass/:wordClass', validateApiKey, getWordsFilteredByWordClass);
router.get('/words/:id', validateApiKey, validId, getWord);
router.get('/examples', validateApiKey, getExamples);
router.get('/examples/:id', validateApiKey, validId, getExample);
router.get('/stats', validateApiKey, APIStats);

router.post('/developers', createDeveloperLimiter, validateDeveloperBody, postDeveloper);

export default router;
