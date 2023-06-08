import mongoose from 'mongoose';
import Version from '../../src/shared/constants/Version';

export const LOCAL_ROUTE = '/';
export const API_ROUTE = `/api/${Version.VERSION_1}`;
export const API_ROUTE_V2 = `/api/${Version.VERSION_2}`;
export const TEST_ROUTE = `/api/${Version.VERSION_1}/test`;
export const API_URL = 'https://igboapi.com';

export const SAVE_DOC_DELAY = 2000;

export const WORD_KEYS_V1 = [
  'variations',
  'definitions',
  'stems',
  'id',
  'word',
  'wordClass',
  'pronunciation',
  'relatedTerms',
  'hypernyms',
  'hyponyms',
  'nsibidi',
  'attributes',
];
export const WORD_KEYS_V2 = [
  'variations',
  'definitions',
  'stems',
  'id',
  'word',
  'pronunciation',
  'relatedTerms',
  'hypernyms',
  'hyponyms',
  'attributes',
  'tags',
];
export const EXAMPLE_KEYS_V1 = [
  'igbo',
  'english',
  'meaning',
  'nsibidi',
  'style',
  'associatedWords',
  'id',
  'pronunciation',
  'updatedAt',
  'createdAt',
];
export const EXAMPLE_KEYS_V2 = [
  'igbo',
  'english',
  'meaning',
  'style',
  'type',
  'associatedWords',
  'associatedDefinitionsSchemas',
  'id',
  'nsibidi',
  'pronunciations',
  'updatedAt',
  'createdAt',
];
export const EXCLUDE_KEYS = ['__v', '_id'];
export const SITE_TITLE = 'The First African Language API';
export const DOCS_SITE_TITLE = 'Igbo API Documentation';
export const INVALID_ID = 'fdsafdsad';
export const NONEXISTENT_ID = new mongoose.Types.ObjectId();
export const MAIN_KEY = 'main_key';
export const FALLBACK_API_KEY = 'fallback_api_key';
