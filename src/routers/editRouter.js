import express from 'express';
import { postWordSuggestion, putWordSuggestion } from '../controllers/wordSuggestions';
import { postExampleSuggestion, putExampleSuggestion } from '../controllers/exampleSuggestions';

const editRouter = express.Router();

/* These routes are used to allow users to suggest new words and examples */
editRouter.post('/words', postWordSuggestion);
editRouter.put('/words', putWordSuggestion);

editRouter.post('/examples', postExampleSuggestion);
editRouter.put('/examples', putExampleSuggestion);

export default editRouter;
