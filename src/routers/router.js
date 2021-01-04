import express from 'express';
import { getWords, getWord } from '../controllers/words';
import { getExamples, getExample } from '../controllers/examples';
import { postDeveloper } from '../controllers/developers';
import authentication from '../middleware/authentication';
import validId from '../middleware/validId';
import validateDeveloperBody from '../middleware/validateDeveloperBody';
import validateApiKey from '../middleware/validateApiKey';

const router = express.Router();

router.use(authentication);

router.get('/words', validateApiKey, getWords);
router.get('/words/:id', validateApiKey, validId, getWord);
router.get('/examples', validateApiKey, getExamples);
router.get('/examples/:id', validateApiKey, validId, getExample);

if (process.env.NODE_ENV !== 'production') {
  router.post('/developers', validateDeveloperBody, postDeveloper);
}

export default router;
