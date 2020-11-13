import express from 'express';
import { getWords, getWord } from '../controllers/words';
import { getExamples, getExample } from '../controllers/examples';
import validId from '../middleware/validId';

const router = express.Router();

router.get('/words', getWords);
router.get('/words/:id', validId, getWord);
router.get('/examples', getExamples);
router.get('/examples/:id', validId, getExample);

export default router;
