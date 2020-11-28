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
import UserRoles from '../shared/constants/userRoles';

const editorRouter = express.Router();

// TODO: #272 create middleware to parse stringified JSON

/* These routes are used to allow users to suggest new words and examples */
editorRouter.post('/words', authorization([UserRoles.MERGER, UserRoles.ADMIN]), mergeWord);
editorRouter.put('/words/:id', validId, authorization([UserRoles.MERGER, UserRoles.ADMIN]), putWord);
editorRouter.post('/examples', authorization([UserRoles.MERGER, UserRoles.ADMIN]), mergeExample);
editorRouter.put('/examples/:id', validId, authorization([UserRoles.MERGER, UserRoles.ADMIN]), putExample);

editorRouter.post('/wordSuggestions', postWordSuggestion);
editorRouter.get('/wordSuggestions', getWordSuggestions);
editorRouter.put('/wordSuggestions/:id', validId, putWordSuggestion);
editorRouter.get('/wordSuggestions/:id', validId, getWordSuggestion);
editorRouter.delete(
  '/wordSuggestions/:id',
  validId,
  authorization([UserRoles.MERGER, UserRoles.ADMIN]),
  deleteWordSuggestion,
);

editorRouter.post('/exampleSuggestions', postExampleSuggestion);
editorRouter.get('/exampleSuggestions', getExampleSuggestions);
editorRouter.put('/exampleSuggestions/:id', validId, putExampleSuggestion);
editorRouter.get('/exampleSuggestions/:id', validId, getExampleSuggestion);
editorRouter.delete(
  '/exampleSuggestions/:id',
  validId,
  authorization([UserRoles.MERGER, UserRoles.ADMIN]),
  deleteExampleSuggestion,
);

editorRouter.post('/genericWords', createGenericWords);
editorRouter.put('/genericWords/:id', validId, putGenericWord);
editorRouter.get('/genericWords', getGenericWords);
editorRouter.get('/genericWords/:id', validId, getGenericWord);
editorRouter.delete(
  '/genericWords/:id',
  validId,
  authorization([UserRoles.MERGER, UserRoles.ADMIN]),
  deleteGenericWord,
);

export default editorRouter;
