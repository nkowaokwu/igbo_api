import express from 'express';
import { getWords, getWord } from '../controllers/words';
import { getExamples, getExample } from '../controllers/examples';
import { postWordSuggestion } from '../controllers/wordSuggestions';
import { postExampleSuggestion } from '../controllers/exampleSuggestions';
import validId from '../middleware/validId';
import authorization from '../middleware/authorization';
import validateWordBody from '../middleware/validateWordBody';
import validateExampleBody from '../middleware/validateExampleBody';

const router = express.Router();

router.get('/words', getWords);
router.get('/words/:id', validId, getWord);
router.get('/examples', getExamples);
router.get('/examples/:id', validId, getExample);

router.post('/wordSuggestions', authorization([]), validateWordBody, postWordSuggestion);
router.post('/exampleSuggestions', authorization([]), validateExampleBody, postExampleSuggestion);

export default router;
