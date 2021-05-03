/* eslint-disable */
import React from 'react';
import axios from 'axios';
import { omit } from 'lodash';
import queryString from 'query-string';
import Head from 'next/head';
import App from 'next/app';
import { API_ROUTE } from '../siteConstants';
import './fonts.less';
import './styles.less';

const MainApp = ({ Component, pageProps, searchWord, words }) => {
  return (
    <>
      <Head>
        <title>Igbo API - The First African Language API</title>
      </Head>
      <Component {...pageProps} searchWord={searchWord} words={words} />
    </>
  );
};

MainApp.getInitialProps = async (appContext) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext);

  const { pathname, query } = appContext.router;
  const searchWord = query.word;
  const queries = omit(query, ['word']);
  const queriesString = queryString.stringify(queries);
  const appendQueries = queriesString ? `&${queriesString}` : '';
  try {
    if (pathname === '/' && searchWord) {
      const res = await axios({
        method: 'get',
        url: `${API_ROUTE}/api/v1/words?keyword=${searchWord}${appendQueries}`,
        headers: {
          'X-API-Key': process.env.MAIN_KEY || 'main_key',
        }
      });
      return { ...appProps, searchWord, words: res.data };
    }
    return appProps;
  } catch (err) {
    return { ...appProps, searchWord, words: [] };
  }
};

export default MainApp;