import React from 'react';
import axios from 'axios';
import { API_ROUTE } from '../siteConstants';
import { MAIN_KEY } from '../config';
import App from './App';

export const getServerSideProps = async (context) => {
  try {
    const { query } = context;
    const searchWord = encodeURI(query.word);
    const queries = Object.entries(query).reduce((finalQueries, [key, value]) => {
      let updatedQueries = finalQueries;
      if (key !== 'word') {
        updatedQueries += `&${key}=${value}`;
      }
      return updatedQueries;
    }, '');
    if (searchWord) {
      const { data: words } = await axios({
        method: 'get',
        url: `${API_ROUTE}/api/v1/words?keyword=${searchWord}${queries}`,
        headers: {
          'X-API-Key': MAIN_KEY || 'main_key',
        },
      });
      return { props: { searchWord: '', words: words || [] } };
    }
    return { props: { searchWord: '', words: [] } };
  } catch (err) {
    console.trace(err);
    return {
      props: {
        searchWord: '',
        words: ['An internal error has occurred'],
      },
    };
  }
};

const IgboAPIApp = (props) => <App {...props} />;

export default IgboAPIApp;
