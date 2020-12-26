import express from 'express';
import { getWords, getWord } from '../controllers/words';
import { getExamples, getExample } from '../controllers/examples';
import { postDeveloper } from '../controllers/developers';
import { postWordSuggestion } from '../controllers/wordSuggestions';
import { postExampleSuggestion } from '../controllers/exampleSuggestions';
import validId from '../middleware/validId';
import authorization from '../middleware/authorization';
import validateWordBody from '../middleware/validateWordBody';
import validateExampleBody from '../middleware/validateExampleBody';
import validateDeveloperBody from '../middleware/validateDeveloperBody';
import validateApiKey from '../middleware/validateApiKey';

const router = express.Router();

router.get('/words', validateApiKey, getWords);
router.get('/words/:id', validateApiKey, validId, getWord);
router.get('/examples', validateApiKey, getExamples);
router.get('/examples/:id', validateApiKey, validId, getExample);

router.post('/developers', validateDeveloperBody, postDeveloper);

router.post('/wordSuggestions', authorization([]), validateWordBody, postWordSuggestion);
router.post('/exampleSuggestions', authorization([]), validateExampleBody, postExampleSuggestion);

export default router;
