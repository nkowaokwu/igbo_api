const API_ROOT = process.env.NODE_ENV === 'production' ? 'https://www.igboapi.com' : 'http://localhost:8080';

export const WORDS_API_URL = `${API_ROOT}/api/v1/words`;
export const WORD_SUGGESTIONS_API_URL = `${API_ROOT}/api/v1/wordSuggestions`;
