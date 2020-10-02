import express from 'express';
import { getWords } from '../controllers/words';
import { seedDatabase } from '../dictionaries/seed';

const testRouter = express.Router();

testRouter.post('/populate', seedDatabase);
testRouter.get('/words', getWords);

export default testRouter;