import express from 'express';
import {
  deleteWordSuggestion,
  getWordSuggestion,
  getWordSuggestions,
  postWordSuggestion,
  putWordSuggestion,
} from '../controllers/wordSuggestions';
import { putWord, postWord } from '../controllers/words';
import { putExample, postExample } from '../controllers/examples';
import {
  getExampleSuggestion,
  getExampleSuggestions,
  postExampleSuggestion,
  putExampleSuggestion,
} from '../controllers/exampleSuggestions';
import {
  getGenericWords,
  createGenericWords,
  putGenericWord,
  getGenericWord,
} from '../controllers/genericWords';

const editorRouter = express.Router();

/* These routes are used to allow users to suggest new words and examples */
editorRouter.post('/words', postWord);
editorRouter.put('/words/:id', putWord);
editorRouter.post('/examples', postExample);
editorRouter.put('/examples/:id', putExample);

editorRouter.post('/wordSuggestions', postWordSuggestion);
editorRouter.get('/wordSuggestions', getWordSuggestions);
editorRouter.put('/wordSuggestions/:id', putWordSuggestion);
editorRouter.get('/wordSuggestions/:id', getWordSuggestion);
editorRouter.delete('/wordSuggestions/:id', deleteWordSuggestion);

editorRouter.post('/exampleSuggestions', postExampleSuggestion);
editorRouter.get('/exampleSuggestions', getExampleSuggestions);
editorRouter.put('/exampleSuggestions/:id', putExampleSuggestion);
editorRouter.get('/exampleSuggestions/:id', getExampleSuggestion);

editorRouter.post('/genericWords', createGenericWords);
editorRouter.put('/genericWords/:id', putGenericWord);
editorRouter.get('/genericWords', getGenericWords);
editorRouter.get('/genericWords/:id', getGenericWord);

export default editorRouter;
