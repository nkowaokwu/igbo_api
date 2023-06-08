import compact from 'lodash/compact';
import { searchIgboTextSearch, strictSearchIgboQuery, searchDefinitionsWithinIgboTextSearch } from './queries';
import { findWordsWithMatch } from './buildDocs';
import { sortDocsBy } from './sortDocsBy';
import { getCachedWords, setCachedWords } from '../../APIs/RedisAPI';
import { handleWordFlags } from '../../APIs/FlagsAPI';

/* Searches for a word with Igbo stored in MongoDB */
const searchWordUsingIgbo = async ({
  redisClient,
  keywords,
  version,
  regex,
  strict,
  isUsingMainKey,
  searchWord,
  skip,
  limit,
  flags,
  filters,
}) => {
  let responseData = { words: [], contentLength: 0 };
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
        : null))
      : keywords;
    const regularSearchIgboQuery = searchIgboTextSearch({
      keywords: allSearchKeywords,
      isUsingMainKey,
      filters,
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
      filters,
    });
    console.time(`Searching Igbo words for ${searchWord}`);
    const [igboResults, englishResults] = await Promise.all([
      findWordsWithMatch({ match: igboQuery, version }),
      findWordsWithMatch({ match: definitionsWithinIgboQuery, version }),
    ]);
    console.timeEnd(`Searching Igbo words for ${searchWord}`);
    // Prevents from duplicate word documents from being included in the final words array
    const words = searchWord ? igboResults.words.concat(englishResults.words).reduce((finalWords, word) => {
      if (!finalWords.find((finalWord) => finalWord.id.equals(word.id.toString()))) {
        finalWords.push(word);
      }
      return finalWords;
    }, []) : igboResults.words;
    const contentLength = words.length;

    responseData = await setCachedWords({
      key: redisWordsCacheKey,
      data: { words, contentLength },
      redisClient,
      version,
    });
  }

  let sortedWords = sortDocsBy(searchWord, responseData.words, 'word', version, regex);
  sortedWords = sortedWords.slice(skip, skip + limit);
  return handleWordFlags({
    data: { words: sortedWords, contentLength: responseData.contentLength },
    flags,
  });
};

export default searchWordUsingIgbo;
