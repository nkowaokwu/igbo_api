import express from 'express';
import { getWordData } from '../controllers/words';
import { seedDatabase } from '../dictionaries/seed';

const testRouter = express.Router();

testRouter.get('/', (_, res) => {
  res.send('Welcome to the Igbo English Dictionary API');
});

testRouter.post('/populate', seedDatabase);
testRouter.get('/words', getWordData);

export default testRouter;
