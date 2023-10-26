import React from 'react';
import axios from 'axios';
import { API_ROUTE, GITHUB_CONTRIBUTORS, GITHUB_STARS } from '../siteConstants';
import { MAIN_KEY, GITHUB_STATS_TOKEN } from '../config';
import App from './App';

const getGitHubContributors = async () => {
  const gitHubAuthorization = GITHUB_STATS_TOKEN;
  const res = await axios({
    method: 'get',
    url: GITHUB_CONTRIBUTORS,
    headers: {
      ...(gitHubAuthorization ? { Authorization: `token ${gitHubAuthorization}` } : {}),
    },
  }).catch(() => ({ data: [] }));
  return res.data || [];
};

const getGitHubStars = async () => {
  const gitHubAuthorization = GITHUB_STATS_TOKEN;
  const res = await axios({
    method: 'get',
    url: GITHUB_STARS,
    headers: {
      ...(gitHubAuthorization ? { Authorization: `token ${gitHubAuthorization}` } : {}),
    },
  })
    .then(({ data }) => ({ data: data.watchers_count }))
    .catch(() => ({ data: 0 }));
  return res.data || 0;
};

const getDatabaseStats = async () => {
  const res = await axios({
    method: 'get',
    url: `${API_ROUTE}/api/v1/stats`,
    headers: {
      'X-API-Key': MAIN_KEY || 'main_key',
    },
  }).catch(() => ({}));
  // @ts-expect-error data
  return res.data || {};
};

const getWords = async (searchWord: string, queries: string) => {
  const res = await axios({
    method: 'get',
    url: `${API_ROUTE}/api/v1/words?keyword=${searchWord}${queries}`,
    headers: {
      'X-API-Key': MAIN_KEY || 'main_key',
    },
  }).catch(() => ({}));
  // @ts-expect-error data
  return res.data || {};
};

export const getServerSideProps = async (context: any) => {
  try {
    let promises: any[] = [async () => ({ data: [] })];
    const { res, query } = context;
    res.setHeader('Cache-Control', 'public, max-age=302400, s-maxage=604800');
    const searchWord = encodeURI(query.word);
    const queries = Object.entries(query).reduce((finalQueries, [key, value]) => {
      let updatedQueries = finalQueries;
      if (key !== 'word') {
        updatedQueries += `&${key}=${value}`;
      }
      return updatedQueries;
    }, '');
    if (searchWord) {
      promises[0] = getWords(searchWord, queries);
    }
    promises = promises.concat([getDatabaseStats(), getGitHubContributors(), getGitHubStars()]);
    const [words, databaseStats, contributors, stars] = await Promise.all(promises);
    return {
      props: {
        searchWord: '',
        words: words || [],
        databaseStats,
        gitHubStats: { contributors, stars },
      },
    };
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

const IgboAPIApp = (props: any) => <App {...props} />;

export default IgboAPIApp;
