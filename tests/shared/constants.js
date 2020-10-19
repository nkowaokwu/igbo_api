import mongoose from 'mongoose';

export const LONG_TIMEOUT = 30000;
export const EDIT_API_ROUTE = '/api/v1/edit';
export const API_ROUTE = '/api/v1';
export const TEST_ROUTE = '/api/v1/test';

export const WORD_KEYS = ['variations', 'definitions', 'stems', 'examples', 'id', 'normalized', 'word', 'wordClass'];
export const EXAMPLE_KEYS = ['igbo', 'english', 'associatedWords', 'id'];
export const EXAMPLE_SUGGESTION_KEYS = [
  'igbo',
  'english',
  'associatedWords',
  'details',
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
  'details',
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
  'details',
  'approvals',
  'denials',
  'updatedOn',
  'merged',
  'id',
];
export const EXCLUDE_KEYS = ['__v', '_id'];
export const INVALID_ID = 'fdsafdsad';
export const NONEXISTENT_ID = new mongoose.Types.ObjectId();
