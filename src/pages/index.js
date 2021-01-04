import React from 'react';
import axios from 'axios';
import { API_ROUTE } from '../siteConstants';
import App from './App';

export const getServerSideProps = async (context) => {
  try {
    const { query } = context;
    const searchWord = query.word;
    if (searchWord) {
      const { data: words } = await axios({
        method: 'get',
        url: `${API_ROUTE}/api/v1/words?keyword=${searchWord}`,
        headers: {
          ...(process.env.MAIN_KEY ? { 'X-API-Key': process.env.MAIN_KEY } : {}),
        },
      });
      return { props: { searchWord, words } };
    }
    return { props: {} };
  } catch {
    return {
      props: {
        searchWord: '',
        words: ['An internal error has occurred'],
      },
    };
  }
};

export default (props) => <App {...props} />;
