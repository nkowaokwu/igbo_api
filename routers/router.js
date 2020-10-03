import express from 'express';
import { getWords } from '../controllers/words';

const router = express.Router();

router.get('/words', getWords);

export default router;