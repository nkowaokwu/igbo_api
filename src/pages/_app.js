/* eslint-disable */
import React from 'react';
import axios from 'axios';
import _, { omit } from 'lodash';
import queryString from 'query-string';
import Head from 'next/head';
import App from 'next/app';
import { API_ROUTE, GITHUB_CONTRIBUTORS, GITHUB_STARS} from '../siteConstants';
import '../fonts.css';
import '../styles.css';

const MainApp = ({ Component, pageProps, ...rest }) => {
  return (
    <>
      <Head>
        <title>Igbo API - The First African Language API</title>
      </Head>
      <Component {...pageProps} {...rest} />
    </>
  );
};

const getGitHubContributors = async () => {
  const gitHubAuthorization = process.env.GITHUB_STATS_TOKEN;
  const res = await axios({
    method: 'get',
    url: GITHUB_CONTRIBUTORS,
    headers: {
      ...(gitHubAuthorization ? { 'Authorization': `token ${gitHubAuthorization}` } : {}),
    }
  })
  .catch(() => ({ data: 0 }));
  return res.data || 0;
}

const getGitHubStars = async () => {
  const gitHubAuthorization = process.env.GITHUB_STATS_TOKEN;
  const res = await axios({
    method: 'get',
    url: GITHUB_STARS,
    headers: {
      ...(gitHubAuthorization ? { 'Authorization': `token ${gitHubAuthorization}` } : {}),
    }
  })
    .then(({ data }) => ({ data: data.watchers_count }))
    .catch(() => ({ data: 0 }));
  return res.data || 0;
}

const getDatabaseStats = async (apiKey) => {
  const res = await axios({
    method: 'get',
    url: `${API_ROUTE}/api/v1/stats`,
    headers: {
      'X-API-Key': apiKey,
    }
  })
  .catch(() => ({}));
  return res.data || {};
};

const getWordsData = async ({ appContext, apiKey }) => {
  const { pathname, query } = appContext.router;
  const searchWord = query.word;
  const queries = omit(query, ['word']);
  const queriesString = queryString.stringify(queries);
  const appendQueries = queriesString ? `&${queriesString}` : '';
  if (pathname === '/' && searchWord) {
    const res = await axios({
      method: 'get',
      url: `${API_ROUTE}/api/v1/words?keyword=${searchWord}${appendQueries}`,
      headers: {
        'X-API-Key': apiKey,
      }
    })
    .catch(() => ({}));
    return { ...appProps, searchWord, words: res.data };
  }
  return {};
}

MainApp.getInitialProps = async (appContext) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext);
  const { query } = appContext.router;
  const searchWord = query.word;
  const apiKey = process.env.MAIN_KEY || 'main_key';

  try {
    const wordsData = await getWordsData({ appContext, apiKey });
    const databaseStats = await getDatabaseStats(apiKey);
    const gitHubStats = {
      contributors: await getGitHubContributors(),
      stars: await getGitHubStars(),
    }
    return { ...appProps, ...wordsData, databaseStats, gitHubStats };
  } catch (err) {
    return { ...appProps, searchWord, words: [], databaseStats: {}, gitHubStats: {} };
  }
};

export default MainApp;