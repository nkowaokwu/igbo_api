import compact from 'lodash/compact';
import { searchIgboTextSearch, strictSearchIgboQuery, searchDefinitionsWithinIgboTextSearch } from './queries';
import { findWordsWithMatch } from './buildDocs';
import { sortDocsBy } from '.';
import { getCachedWords, setCachedWords } from '../../APIs/RedisAPI';
import { handleTagsFlag, handleWordFlags } from '../../APIs/FlagsAPI';

/* Searches for a word with Igbo stored in MongoDB */
const searchWordUsingIgbo = async ({
  redisClient,
  keywords,
  version,
  regex,
  strict,
  isUsingMainKey,
  filteringParams,
  searchWord,
  skip,
  limit,
  flags,
}) => {
  let responseData = {};
  const redisWordsCacheKey = `${searchWord}-${version}`;
  const cachedWords = await getCachedWords({ key: redisWordsCacheKey, redisClient });

  if (cachedWords) {
    responseData = {
      words: cachedWords.words,
      contentLength: cachedWords.contentLength,
    };
  } else {
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
      findWordsWithMatch({ match: igboQuery, version }),
      findWordsWithMatch({ match: definitionsWithinIgboQuery, version }),
    ]);
    console.timeEnd(`Searching Igbo words for ${searchWord}`);
    const words = igboResults.words.concat(englishResults.words);
    const contentLength = parseInt(igboResults.contentLength, 10) + parseInt(englishResults.contentLength, 10);

    responseData = await setCachedWords({
      key: redisWordsCacheKey,
      data: { words, contentLength },
      redisClient,
      setCachedWords,
    });
  }

  responseData = handleTagsFlag({
    data: { words: responseData.words },
    flags,
  });
  let sortedWords = sortDocsBy(searchWord, responseData.words, 'word', version, regex);
  sortedWords = sortedWords.slice(skip, skip + limit);
  return handleWordFlags({
    data: { words: sortedWords, contentLength: responseData.contentLength },
    flags,
  });
};

export default searchWordUsingIgbo;
