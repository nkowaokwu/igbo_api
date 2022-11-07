import express from 'express';
import redisClient from '../services/redis';
import { getWords, getWord } from '../controllers/words';
import validId from '../middleware/validId';
import validateApiKey from '../middleware/validateApiKey';
import analytics from '../middleware/analytics';

const routerV2 = express.Router();

routerV2.get('/words', analytics, validateApiKey, getWords(redisClient));
routerV2.get('/words/:id', analytics, validateApiKey, validId, getWord);

// Redirects to V1
routerV2.get('/examples', (_, res) => res.redirect('/api/v1/examples'));
routerV2.get('/examples/:id', (_, res) => res.redirect('/api/v1/examples/:id'));
routerV2.post('/developers', (_, res) => res.redirect('/api/v1/developers'));
routerV2.get('/stats', (_, res) => res.redirect('/api/v1/stats'));

export default routerV2;
