import axios from 'axios';
import { WORDS_API_URL, EXAMPLE_SUGGESTIONS_API_URL, WORD_SUGGESTIONS_API_URL } from './config';

export const getWord = (lastSearch, page = 0) => axios.get(`${WORDS_API_URL}?keyword=${lastSearch}&page=${page}`);
export const postWordSuggestion = (data) => axios.post(WORD_SUGGESTIONS_API_URL, data);
export const postExampleSuggestion = (data) => axios.post(EXAMPLE_SUGGESTIONS_API_URL, data);
