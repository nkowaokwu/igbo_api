import { Router } from 'express';
import { getWords, getWord } from '../controllers/words';
import { getExample, getExamples } from '../controllers/examples';
import { getNsibidiCharacter, getNsibidiCharacters } from '../controllers/nsibidi';
import { getTranscription } from '../controllers/speechToText';
import { getTranslation } from '../controllers/translation';
import validId from '../middleware/validId';
import validateApiKey from '../middleware/validateApiKey';
import analytics from '../middleware/analytics';
import attachRedisClient from '../middleware/attachRedisClient';

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
routerV2.post('/translate', analytics, validateApiKey, getTranslation);

// Redirects to V1
routerV2.post('/developers', (_, res) => res.redirect('/api/v1/developers'));
routerV2.get('/stats', (_, res) => res.redirect('/api/v1/stats'));

export default routerV2;
