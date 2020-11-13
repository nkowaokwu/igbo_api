import urlencode from 'urlencode';
/* Takes the query string and transform it into an object */
const parseQueries = (queries) => {
  const queriesMap = queries
    .split(/(\?|&)/)
    .filter((query) => query !== '' && query !== '?' && query !== '&')
    .reduce((queryMap, query) => {
      const keyValuePair = query.split('=');
      return { ...queryMap, [keyValuePair[0]]: urlencode.decode(keyValuePair[1]) };
    }, {});
  return queriesMap;
};

export default parseQueries;
