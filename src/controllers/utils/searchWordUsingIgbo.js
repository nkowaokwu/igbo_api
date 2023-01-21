import compact from 'lodash/compact';
import { searchIgboTextSearch, strictSearchIgboQuery, searchDefinitionsWithinIgboTextSearch } from './queries';
import { findWordsWithMatch } from './buildDocs';
import { sortDocsBy } from '.';

/* Searches for a word with Igbo stored in MongoDB */
const searchWordUsingIgbo = async ({
  keywords,
  strict,
  isUsingMainKey,
  filteringParams,
  searchWord,
  version,
  regex,
  skip,
  limit,
  ...rest
}) => {
  const allSearchKeywords = !keywords.find(({ text }) => text === searchWord)
    ? compact(keywords.concat(searchWord
      ? { text: searchWord, wordClass: [], regex }
      : null),
    )
    : keywords;
  const regularSearchIgboQuery = searchIgboTextSearch({
    keywords: allSearchKeywords,
    isUsingMainKey,
    searchWord,
    filteringParams,
  });
  const igboQuery = !strict
    ? regularSearchIgboQuery
    : strictSearchIgboQuery(
      allSearchKeywords,
    );
  const definitionsWithinIgboQuery = searchDefinitionsWithinIgboTextSearch({
    keywords: allSearchKeywords,
    isUsingMainKey,
    searchWord,
    filteringParams,
  });
  console.time(`Searching Igbo words for ${searchWord}`);
  const [igboResults, englishResults] = await Promise.all([
    await findWordsWithMatch({ match: igboQuery, version, ...rest }),
    await findWordsWithMatch({ match: definitionsWithinIgboQuery, version, ...rest }),
  ]);
  const words = igboResults.words.concat(englishResults.words);
  const contentLength = parseInt(igboResults.contentLength, 10) + parseInt(englishResults.contentLength, 10);

  let sortedWords = sortDocsBy(searchWord, words, 'word', version, regex);
  sortedWords = sortedWords.slice(skip, skip + limit);
  console.timeEnd(`Searching Igbo words for ${searchWord}`);
  return { words: sortedWords, contentLength };
};

export default searchWordUsingIgbo;
