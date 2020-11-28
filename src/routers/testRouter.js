import express from 'express';
import { getWordData } from '../controllers/words';
import { seedDatabase } from '../dictionaries/seed';
import sendEmailJob from '../services/sendEmail';

const testRouter = express.Router();

testRouter.get('/', (_, res) => {
  res.send('Welcome to the Igbo English Dictionary API');
});

testRouter.post('/populate', seedDatabase);
testRouter.get('/words', getWordData);
testRouter.post('/email/mergedStats', async (_, res) => {
  const result = await sendEmailJob();
  if (!result.startsWith('Success:')) {
    res.status(400);
    res.send({ error: result });
  }
  res.send({ message: result });
});

export default testRouter;
