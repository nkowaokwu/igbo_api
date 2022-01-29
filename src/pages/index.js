import React from 'react';
import axios from 'axios';
import { API_ROUTE } from '../siteConstants';
import App from './App';

export const getServerSideProps = async (context) => {
  try {
    const { query } = context;
    const searchWord = encodeURI(query.word);
    if (searchWord) {
      const { data: words } = await axios({
        method: 'get',
        url: `${API_ROUTE}/api/v1/words?keyword=${searchWord}`,
        headers: {
          'X-API-Key': process.env.MAIN_KEY || 'main_key',
        },
      });
      return { props: { searchWord: '', words: words || [] } };
    }
    return { props: { searchWord: '', words: [] } };
  } catch (err) {
    console.log(err);
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
