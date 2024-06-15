import axios from 'axios';
import { API_ROUTE, GITHUB_CONTRIBUTORS, GITHUB_STARS } from './siteConstants';

const { MAIN_KEY, GITHUB_STATS_TOKEN } = process.env;

export const getGitHubContributors = async () => {
  const gitHubAuthorization = GITHUB_STATS_TOKEN;
  const res = await axios({
    method: 'GET',
    url: GITHUB_CONTRIBUTORS,
    headers: {
      ...(gitHubAuthorization ? { Authorization: `token ${gitHubAuthorization}` } : {}),
    },
  }).catch(() => ({ data: [] }));
  return res.data || [];
};

export const getGitHubStars = async () => {
  const gitHubAuthorization = GITHUB_STATS_TOKEN;
  const res = await axios({
    method: 'GET',
    url: GITHUB_STARS,
    headers: {
      ...(gitHubAuthorization ? { Authorization: `token ${gitHubAuthorization}` } : {}),
    },
  })
    .then(({ data }) => ({ data: data.watchers_count }))
    .catch(() => ({ data: 0 }));
  return res.data || 0;
};

export const getDatabaseStats = async () => {
  const res = await axios({
    method: 'GET',
    url: `${API_ROUTE}/api/v1/stats`,
    headers: {
      'X-API-Key': MAIN_KEY || 'main_key',
    },
  }).catch(() => ({}));
  // @ts-expect-error data
  return res.data || {};
};

export const getWords = async (searchWord: string, queries: string) => {
  const res = await axios({
    method: 'GET',
    url: `${API_ROUTE}/api/v1/words?keyword=${searchWord}${queries}`,
    headers: {
      'X-API-Key': MAIN_KEY || 'main_key',
    },
  }).catch(() => ({}));
  // @ts-expect-error data
  return res.data || {};
};

export const getStats = async () => ({
  databaseStats: await getDatabaseStats(),
  contributors: await getGitHubContributors(),
  stars: await getGitHubStars(),
});
