import express from 'express';
import { postWordSuggestion, putWordSuggestion } from '../controllers/wordSuggestions';
import { postExampleSuggestion, putExampleSuggestion } from '../controllers/exampleSuggestions';

const editRouter = express.Router();

/* These routes are used to allow users to suggest new words and examples */
if (process.env.NODE_ENV !== 'production') { // TODO: remove this guard rail when releasing for production
  editRouter.post('/words', postWordSuggestion);
  editRouter.put('/words', putWordSuggestion);

  editRouter.post('/examples', postExampleSuggestion);
  editRouter.put('/examples', putExampleSuggestion);
}

export default editRouter;
