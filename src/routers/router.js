import express from 'express';
import { getWords, getWord } from '../controllers/words';
import { getExamples, getExample } from '../controllers/examples';

const router = express.Router();

router.get('/words', getWords);
router.get('/words/:id', getWord);
router.get('/examples', getExamples);
router.get('/examples/:id', getExample);

export default router;
