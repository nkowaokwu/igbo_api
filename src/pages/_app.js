/* eslint-disable */
import React from 'react';
import axios from 'axios';
import Head from 'next/head';
import App from 'next/app';
import { API_ROUTE } from '../siteConstants';
import './fonts.css';
import './styles.css';

const MainApp = ({ Component, pageProps, searchWord, words }) => {
  return (
    <>
      <Head>
        <title>Igbo API - The First Afrifcan Language API</title>
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
  if (pathname === '/' && searchWord) {
    const res = await axios({
      method: 'get',
      url: `${API_ROUTE}/api/v1/words?keyword=${searchWord}`,
      headers: {
        'X-API-Key': process.env.MAIN_KEY,
      }
    });
    return { ...appProps, searchWord, words: res.data };
  }
  return appProps;
};

export default MainApp;