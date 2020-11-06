/* Takes the query string and transform it into an object */
const parseQueries = (search) => (
  search
    .split(/(\?|&)/)
    .filter((query) => query !== '' && query !== '?' && query !== '&')
    .reduce((queryMap, query) => {
      const keyValuePair = query.split('=');
      return { ...queryMap, [keyValuePair[0]]: keyValuePair[1] };
    }, {})
);

export default parseQueries;
