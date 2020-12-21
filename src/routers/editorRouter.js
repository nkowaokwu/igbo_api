import express from 'express';
import {
  deleteWordSuggestion,
  getWordSuggestion,
  getWordSuggestions,
  putWordSuggestion,
} from '../controllers/wordSuggestions';
import { deleteWord, putWord, mergeWord } from '../controllers/words';
import { putExample, mergeExample } from '../controllers/examples';
import {
  deleteExampleSuggestion,
  getExampleSuggestion,
  getExampleSuggestions,
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
import validateExampleBody from '../middleware/validateExampleBody';
import validateExampleMerge from '../middleware/validateExampleMerge';
import validateWordBody from '../middleware/validateWordBody';
import validateWordMerge from '../middleware/validateWordMerge';
import UserRoles from '../shared/constants/userRoles';

const editorRouter = express.Router();

/* These routes are used to allow users to suggest new words and examples */
editorRouter.post('/words', authorization([UserRoles.MERGER, UserRoles.ADMIN]), validateWordMerge, mergeWord);
editorRouter.put('/words/:id', validId, authorization([UserRoles.MERGER, UserRoles.ADMIN]), putWord);
editorRouter.delete('/words/:id', validId, authorization([UserRoles.MERGER, UserRoles.ADMIN]), deleteWord);

editorRouter.post('/examples', authorization([UserRoles.MERGER, UserRoles.ADMIN]), validateExampleMerge, mergeExample);
editorRouter.put('/examples/:id', validId, authorization([UserRoles.MERGER, UserRoles.ADMIN]), putExample);

editorRouter.get('/wordSuggestions', getWordSuggestions);
editorRouter.put('/wordSuggestions/:id', validId, validateWordBody, putWordSuggestion);
editorRouter.get('/wordSuggestions/:id', validId, getWordSuggestion);
editorRouter.delete(
  '/wordSuggestions/:id',
  validId,
  authorization([UserRoles.MERGER, UserRoles.ADMIN]),
  deleteWordSuggestion,
);

editorRouter.get('/exampleSuggestions', getExampleSuggestions);
editorRouter.put('/exampleSuggestions/:id', validId, validateExampleBody, putExampleSuggestion);
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
