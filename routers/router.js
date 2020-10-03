import express from 'express';
import { getWordData } from '../controllers/words';

const router = express.Router();

router.get('/', (_, res) => {
    res.send('Welcome to the Igbo English Dictionary API');
});

router.get('/words', getWordData);

export default router;