import stringSimilarity from 'string-similarity';
import diacriticless from 'diacriticless';
import { assign, orderBy } from 'lodash';
import removePrefix from '../../shared/utils/removePrefix';
import createRegExp from '../../shared/utils/createRegExp';

const DEFAULT_RESPONSE_LIMIT = 10;
const MAX_RESPONSE_LIMIT = 25;

/* Either creates a regex pattern for provided searchWord
or fallbacks to matching every word */
export const createQueryRegex = (searchWord) => (!searchWord ? /./ : createRegExp(searchWord));

/* Sorts all the docs based on the provided searchWord */
export const sortDocsBy = (searchWord, docs, key) => {
  docs.sort((prevDoc, nextDoc) => {
    const prevDocValue = Array.isArray(prevDoc[key]) ? prevDoc[key][0] : prevDoc[key];
    const nextDocValue = Array.isArray(nextDoc[key]) ? nextDoc[key][0] : nextDoc[key];
    const prevDocDifference = stringSimilarity.compareTwoStrings(searchWord, diacriticless(prevDocValue) || '') * -100;
    const nextDocDifference = stringSimilarity.compareTwoStrings(searchWord, diacriticless(nextDocValue) || '') * -100;
    return prevDocDifference - nextDocDifference;
  });
  return docs;
};

/* Validates the provided range */
export const isValidRange = (range) => {
  if (!Array.isArray(range)) {
    return false;
  }

  /* Invalid range if first element is larger than the second */
  if (range[0] >= range[1]) {
    return false;
  }

  const validRange = range;
  validRange[1] += 1;
  return !(validRange[1] - validRange[0] > MAX_RESPONSE_LIMIT) && !(validRange[1] - validRange[0] < 0);
};

/* Takes both page and range and converts them into appropriate skip and limit */
export const convertToSkipAndLimit = ({ page, range }) => {
  let skip = 0;
  let limit = 10;
  if (isValidRange(range)) {
    [skip] = range;
    limit = range[1] - range[0];
    return { skip, limit };
  }
  // TODO: #239 Throw errors for invalid queries
  const calculatedSkip = page * DEFAULT_RESPONSE_LIMIT;
  if (calculatedSkip < 0) {
    return { skip: 0, limit: 0 };
  }
  return { skip: calculatedSkip, limit };
};

/* Packages the res response with sorting */
export const packageResponse = async ({
  res,
  docs,
  model,
  query,
  sort,
}) => {
  try {
    const count = await model.countDocuments(query);
    res.setHeader('Content-Range', count);
    const sendDocs = sort ? orderBy(docs, [sort.key], [sort.direction]) : docs;
    res.send(sendDocs);
  } catch (err) {
    res.status(400);
    res.send({ error: err.message });
  }
};

/* Converts the filter query into a word to be used as the keyword query */
const convertFilterToKeyword = (filter = '{"word": ""}') => {
  try {
    const parsedFilter = typeof filter === 'object' ? filter : JSON.parse(filter) || { word: '' };
    const firstFilterKey = Object.keys(parsedFilter)[0];
    return parsedFilter[firstFilterKey];
  } catch {
    return '';
  }
};

/* Parses the ranges query to turn into an array */
const parseRange = (range) => {
  try {
    const parsedRange = typeof range === 'object' ? range : JSON.parse(range) || null;
    return parsedRange;
  } catch {
    return null;
  }
};

/* Parses out the key and the direction of sorting out into an object */
const parseSortKeys = (sort = '["", ""]') => {
  try {
    const parsedSort = JSON.parse(sort) || ['id', 'ASC'];
    const key = parsedSort[0];
    const direction = parsedSort[1].toLowerCase() || '';
    return {
      key,
      direction,
    };
  } catch {
    return null;
  }
};

/* Handles all the queries for searching in the database */
export const handleQueries = (query = {}) => {
  const {
    keyword = '',
    page: pageQuery = '',
    range: rangeQuery = '',
    sort: sortQuery,
    filter: filterQuery,
  } = query;
  const filter = convertFilterToKeyword(filterQuery);
  const searchWord = removePrefix(keyword || filter || '');
  const regexKeyword = createQueryRegex(searchWord);
  const page = parseInt(pageQuery, 10) || 0;
  const range = parseRange(rangeQuery) || 0;
  const { skip, limit } = convertToSkipAndLimit({ page, range });
  const sort = parseSortKeys(sortQuery);
  return {
    searchWord,
    regexKeyword,
    page,
    sort,
    skip,
    limit,
  };
};

/* Updates a document's merge property with a document id */
export const updateDocumentMerge = (suggestionDoc, originalDocId) => {
  const updatedSuggestion = assign(suggestionDoc, { merged: originalDocId });
  return updatedSuggestion.save();
};
