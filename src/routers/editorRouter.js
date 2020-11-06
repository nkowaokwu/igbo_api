import express from 'express';
import {
  deleteWordSuggestion,
  getWordSuggestion,
  getWordSuggestions,
  postWordSuggestion,
  putWordSuggestion,
} from '../controllers/wordSuggestions';
import { putWord, mergeWord } from '../controllers/words';
import { putExample, mergeExample } from '../controllers/examples';
import {
  deleteExampleSuggestion,
  getExampleSuggestion,
  getExampleSuggestions,
  postExampleSuggestion,
  putExampleSuggestion,
} from '../controllers/exampleSuggestions';
import {
  deleteGenericWord,
  getGenericWords,
  createGenericWords,
  putGenericWord,
  getGenericWord,
} from '../controllers/genericWords';
import authorization from '../middleware/authorization';

const editorRouter = express.Router();

/* These routes are used to allow users to suggest new words and examples */
editorRouter.post('/words', authorization(['merger', 'admin']), mergeWord);
editorRouter.put('/words/:id', authorization(['merger', 'admin']), putWord);
editorRouter.post('/examples', authorization(['merger', 'admin']), mergeExample);
editorRouter.put('/examples/:id', authorization(['merger', 'admin']), putExample);

editorRouter.post('/wordSuggestions', postWordSuggestion);
editorRouter.get('/wordSuggestions', getWordSuggestions);
editorRouter.put('/wordSuggestions/:id', putWordSuggestion);
editorRouter.get('/wordSuggestions/:id', getWordSuggestion);
editorRouter.delete('/wordSuggestions/:id', authorization(['merger', 'admin']), deleteWordSuggestion);

editorRouter.post('/exampleSuggestions', postExampleSuggestion);
editorRouter.get('/exampleSuggestions', getExampleSuggestions);
editorRouter.put('/exampleSuggestions/:id', putExampleSuggestion);
editorRouter.get('/exampleSuggestions/:id', getExampleSuggestion);
editorRouter.delete('/exampleSuggestions/:id', authorization(['merger', 'admin']), deleteExampleSuggestion);

editorRouter.post('/genericWords', createGenericWords);
editorRouter.put('/genericWords/:id', putGenericWord);
editorRouter.get('/genericWords', getGenericWords);
editorRouter.get('/genericWords/:id', getGenericWord);
editorRouter.delete('/genericWords/:id', authorization(['merger', 'admin']), deleteGenericWord);

// TODO: Create new users routes that will show all users in Firebase

export default editorRouter;
