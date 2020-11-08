import mongoose from 'mongoose';

export const ADMIN_ROUTE = '/admin';
export const API_ROUTE = '/api/v1';
export const TEST_ROUTE = '/api/v1/test';
export const API_URL = 'https://igboapi.com';

export const WORD_KEYS = ['variations', 'definitions', 'stems', 'examples', 'id', 'normalized', 'word', 'wordClass'];
export const EXAMPLE_KEYS = ['igbo', 'english', 'associatedWords', 'id'];
export const EXAMPLE_SUGGESTION_KEYS = [
  'originalExampleId',
  'igbo',
  'english',
  'associatedWords',
  'editorsNotes',
  'userComments',
  'userEmail',
  'approvals',
  'denials',
  'updatedOn',
  'merged',
  'id',
];
export const GENERIC_WORD_KEYS = [
  'word',
  'wordClass',
  'definitions',
  'variations',
  'editorsNotes',
  'userComments',
  'userEmail',
  'approvals',
  'denials',
  'updatedOn',
  'merged',
  'id',
];
export const WORD_SUGGESTION_KEYS = [
  'originalWordId',
  'word',
  'wordClass',
  'definitions',
  'variations',
  'editorsNotes',
  'userComments',
  'userEmail',
  'approvals',
  'denials',
  'updatedOn',
  'merged',
  'id',
];
export const EXCLUDE_KEYS = ['__v', '_id'];
export const INVALID_ID = 'fdsafdsad';
export const NONEXISTENT_ID = new mongoose.Types.ObjectId();
export const MESSAGE = {
  to: 'test@example.com',
};
export const INVALID_MESSAGE = {};
