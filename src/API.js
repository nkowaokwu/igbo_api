import axios from 'axios';
import { WORDS_API_URL } from './config';

export default (lastSearch, page = 0) => axios.get(`${WORDS_API_URL}?keyword=${lastSearch}&page=${page}`);
