import App from './App';

// const getGitHubContributors = async () => {
//   console.time('Fetching GitHub Contributors SSR');
//   const gitHubAuthorization = GITHUB_STATS_TOKEN;
//   const res = await axios({
//     method: 'get',
//     url: GITHUB_CONTRIBUTORS,
//     headers: {
//       ...(gitHubAuthorization ? { Authorization: `token ${gitHubAuthorization}` } : {}),
//     },
//   }).catch(() => ({ data: [] }));
//   console.timeEnd('Fetching GitHub Contributors SSR');
//   return res.data || [];
// };

// const getGitHubStars = async () => {
//   console.time('Fetching GitHub Stars SSR');
//   const gitHubAuthorization = GITHUB_STATS_TOKEN;
//   const res = await axios({
//     method: 'get',
//     url: GITHUB_STARS,
//     headers: {
//       ...(gitHubAuthorization ? { Authorization: `token ${gitHubAuthorization}` } : {}),
//     },
//   })
//     .then(({ data }) => ({ data: data.watchers_count }))
//     .catch(() => ({ data: 0 }));
//   console.timeEnd('Fetching GitHub Stars SSR');
//   return res.data || 0;
// };

export const getServerSideProps = async (context: any) => {
  try {
    const { res } = context;
    res.setHeader('Cache-Control', 'public, max-age=302400, s-maxage=604800');
    return {
      props: {
        searchWord: '',
        words: [],
        databaseStats: {},
        gitHubStats: { contributors: 0, stars: 0 },
      },
    };
  } catch (err) {
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
