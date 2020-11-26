/* This file includes the constants necessary to power the API homepage */
export const PORT = process.env.PORT || 8080;
export const API_ROUTE = process.env.NODE_ENV === 'production' ? '' : `http://localhost:${PORT}`;
export const DICTIONARY_APP_URL = process.env.NODE_ENV === 'production'
  ? 'https://nkowaokwu.com'
  : 'http://localhost:8000'; // A local instance of the dictionary app must be running
export const FROM_EMAIL = process.env.FROM_EMAIL || 'igboapi@gmail.com';
