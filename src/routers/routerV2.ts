import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { getWords, getWord } from '../controllers/words';
import { getExample, getExamples } from '../controllers/examples';
import { getNsibidiCharacter, getNsibidiCharacters } from '../controllers/nsibidi';
import { getTranscription } from '../controllers/speechToText';
import validId from '../middleware/validId';
import validateApiKey from '../middleware/validateApiKey';
import analytics from '../middleware/analytics';
import attachRedisClient from '../middleware/attachRedisClient';
import { getTranslation } from 'src/controllers/translation';
import { MiddleWare } from 'src/types';

const ONE_DAY = 24 * 60 * 60 * 1000;
const REQUESTS_PER_MS_TRANSLATION = 5;

const translationRateLimiter: MiddleWare = rateLimit({
  windowMs: ONE_DAY,
  max: REQUESTS_PER_MS_TRANSLATION,
});

const routerV2 = Router();

routerV2.get('/words', analytics, validateApiKey, attachRedisClient, getWords);
routerV2.get('/words/:id', analytics, validateApiKey, validId, attachRedisClient, getWord);
routerV2.get('/examples', analytics, validateApiKey, attachRedisClient, getExamples);
routerV2.get('/examples/:id', analytics, validateApiKey, validId, attachRedisClient, getExample);
routerV2.get('/nsibidi', analytics, validateApiKey, attachRedisClient, getNsibidiCharacters);
routerV2.get(
  '/nsibidi/:id',
  analytics,
  validateApiKey,
  validId,
  attachRedisClient,
  getNsibidiCharacter
);

// Speech-to-Text
routerV2.post('/speech-to-text', analytics, validateApiKey, getTranscription);
routerV2.post(
  '/igbo-to-english',
  translationRateLimiter,
  analytics,
  validateApiKey,
  getTranslation
);

// Redirects to V1
routerV2.post('/developers', (_, res) => res.redirect('/api/v1/developers'));
routerV2.get('/stats', (_, res) => res.redirect('/api/v1/stats'));

export default routerV2;
