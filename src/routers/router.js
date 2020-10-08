import express from 'express';
import { getPhrases } from '../controllers/phrases';
import { getWords } from '../controllers/words';

const router = express.Router();

router.get('/words', getWords);
router.get('/phrases', getPhrases);

export default router;
