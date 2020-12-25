import mongoose from 'mongoose';

export const LOCAL_ROUTE = '/';
export const API_ROUTE = '/api/v1';
export const TEST_ROUTE = '/api/v1/test';
export const API_URL = 'https://igboapi.com';

export const SAVE_DOC_DELAY = 2000;

export const WORD_KEYS = [
  'accented',
  'variations',
  'definitions',
  'stems',
  'examples',
  'id',
  'normalized',
  'word',
  'wordClass',
  'updatedOn',
];
export const EXAMPLE_KEYS = ['accented', 'igbo', 'english', 'associatedWords', 'id', 'updatedOn'];
export const EXAMPLE_SUGGESTION_KEYS = [
  'originalExampleId',
  'igbo',
  'english',
  'exampleForSuggestion',
  'associatedWords',
  'editorsNotes',
  'userComments',
  'authorId',
  'approvals',
  'denials',
  'updatedOn',
  'merged',
  'mergedBy',
  'id',
];
export const GENERIC_WORD_KEYS = [
  'word',
  'wordClass',
  'definitions',
  'variations',
  'editorsNotes',
  'examples',
  'userComments',
  'approvals',
  'denials',
  'updatedOn',
  'merged',
  'mergedBy',
  'id',
];
export const WORD_SUGGESTION_KEYS = [
  'originalWordId',
  'word',
  'wordClass',
  'definitions',
  'variations',
  'editorsNotes',
  'examples',
  'userComments',
  'authorId',
  'approvals',
  'denials',
  'updatedOn',
  'merged',
  'mergedBy',
  'id',
];
export const EXCLUDE_KEYS = ['__v', '_id'];
export const SITE_TITLE = 'The First African Language API';
export const DOCS_SITE_TITLE = 'Swagger UI';
export const INVALID_ID = 'fdsafdsad';
export const NONEXISTENT_ID = new mongoose.Types.ObjectId();
export const MESSAGE = {
  to: 'test@example.com',
};
export const INVALID_MESSAGE = {};
export const AUTH_TOKEN = {
  ADMIN_AUTH_TOKEN: 'admin-auth-token',
  MERGER_AUTH_TOKEN: 'merger-auth-token',
  EDITOR_AUTH_TOKEN: 'editor-auth-token',
  USER_AUTH_TOKEN: 'user-auth-token',
};
