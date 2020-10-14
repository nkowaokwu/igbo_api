import express from 'express';
import { getWords } from '../controllers/words';

const searchRouter = express.Router();

searchRouter.get('/words', getWords);

export default searchRouter;
