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
import validId from '../middleware/validId';
import authorization from '../middleware/authorization';

const editorRouter = express.Router();

/* These routes are used to allow users to suggest new words and examples */
editorRouter.post('/words', authorization(['merger', 'admin']), mergeWord);
editorRouter.put('/words/:id', validId, authorization(['merger', 'admin']), putWord);
editorRouter.post('/examples', authorization(['merger', 'admin']), mergeExample);
editorRouter.put('/examples/:id', validId, authorization(['merger', 'admin']), putExample);

editorRouter.post('/wordSuggestions', postWordSuggestion);
editorRouter.get('/wordSuggestions', getWordSuggestions);
editorRouter.put('/wordSuggestions/:id', validId, putWordSuggestion);
editorRouter.get('/wordSuggestions/:id', validId, getWordSuggestion);
editorRouter.delete('/wordSuggestions/:id', validId, authorization(['merger', 'admin']), deleteWordSuggestion);

editorRouter.post('/exampleSuggestions', postExampleSuggestion);
editorRouter.get('/exampleSuggestions', getExampleSuggestions);
editorRouter.put('/exampleSuggestions/:id', validId, putExampleSuggestion);
editorRouter.get('/exampleSuggestions/:id', validId, getExampleSuggestion);
editorRouter.delete('/exampleSuggestions/:id', validId, authorization(['merger', 'admin']), deleteExampleSuggestion);

editorRouter.post('/genericWords', createGenericWords);
editorRouter.put('/genericWords/:id', validId, putGenericWord);
editorRouter.get('/genericWords', getGenericWords);
editorRouter.get('/genericWords/:id', validId, getGenericWord);
editorRouter.delete('/genericWords/:id', validId, authorization(['merger', 'admin']), deleteGenericWord);

export default editorRouter;
