/* This file includes the constants necessary to power the API homepage */
export const PORT = process.env.PORT || 8080;
export const API_ROUTE = process.env.HEROKU ? 'https://igboapi.com' : `http://localhost:${PORT}`;
export const DICTIONARY_APP_URL = process.env.HEROKU
  ? 'https://nkowaokwu.com'
  : 'http://localhost:8000';
export const API_FROM_EMAIL = process.env.API_FROM_EMAIL || 'igboapi@gmail.com';
