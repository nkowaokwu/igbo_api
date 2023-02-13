import express from 'express';
import { getWords, getWord } from '../controllers/words';
import validId from '../middleware/validId';
import validateApiKey from '../middleware/validateApiKey';
import analytics from '../middleware/analytics';
import attachRedisClient from '../middleware/attachRedisClient';
import flowRequest from '../shared/utils/flowRequest';

const routerV2 = express.Router();

routerV2.get('/words', ...flowRequest([analytics, validateApiKey, attachRedisClient, getWords]));
routerV2.get('/words/:id', ...flowRequest([analytics, validateApiKey, validId, attachRedisClient, getWord]));

// Redirects to V1
routerV2.get('/examples', (_, res) => res.redirect('/api/v1/examples'));
routerV2.get('/examples/:id', (_, res) => res.redirect('/api/v1/examples/:id'));
routerV2.post('/developers', (_, res) => res.redirect('/api/v1/developers'));
routerV2.get('/stats', (_, res) => res.redirect('/api/v1/stats'));

export default routerV2;
