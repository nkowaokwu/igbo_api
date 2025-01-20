import { compact, uniqWith } from 'lodash';
import { RedisClientType } from 'redis';
import { handleWordFlags } from '../../APIs/FlagsAPI';
import { getCachedWords, setCachedWords } from '../../APIs/RedisAPI';
import Version from '../../shared/constants/Version';
import { SearchRegExp } from '../../shared/utils/createRegExp';
import { Filters } from '../types';
import { findWordsWithMatch } from './buildDocs';
import {
  searchDefinitionsWithinIgboTextSearch,
  searchIgboTextSearch,
  strictSearchIgboQuery,
} from './queries';
import { sortDocsBy } from './sortDocsBy';
import { Keyword } from './types';

type IgboSearch = {
  redisClient: RedisClientType | undefined,
  keywords: Keyword[],
  strict: boolean,
  isUsingMainKey: boolean | undefined,
  version: Version,
  regex: SearchRegExp,
  searchWord: string,
  skip: number,
  limit: number,
  flags: {
    examples: boolean,
    dialects: boolean,
    resolve: boolean,
  },
  filters: Filters,
};

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
}: IgboSearch) => {
  let responseData = { words: [], contentLength: 0 };
  const redisWordsCacheKey = `${searchWord}-${JSON.stringify(filters)}-${version}`;
  const cachedWords = await getCachedWords({ key: redisWordsCacheKey, redisClient });

  if (cachedWords) {
    responseData = {
      words: cachedWords.words,
      contentLength: cachedWords.contentLength,
    };
  } else {
    const allSearchKeywords = !keywords.find(({ text }) => text === searchWord)
      ? compact(searchWord ? keywords.concat({ text: searchWord, wordClass: [], regex }) : null)
      : keywords;
    const regularSearchIgboQuery = searchIgboTextSearch({
      keywords: allSearchKeywords,
      isUsingMainKey,
      filters,
    });
    const igboQuery = !strict ? regularSearchIgboQuery : strictSearchIgboQuery(allSearchKeywords);
    const definitionsWithinIgboQuery = searchDefinitionsWithinIgboTextSearch({
      keywords: allSearchKeywords,
      isUsingMainKey,
      searchWord,
      filters,
    });
    const [igboResults, englishResults] = await Promise.all([
      findWordsWithMatch({ match: igboQuery, version, queryLabel: 'igbo' }),
      findWordsWithMatch({ match: definitionsWithinIgboQuery, version, queryLabel: 'definitions' }),
    ]);
    // Prevents from duplicate word documents from being included in the final words array
    const words = searchWord
      ? uniqWith(
          igboResults.words.concat(englishResults.words),
          (firstWord, secondWord) => firstWord.id.toString() === secondWord.id.toString()
        )
      : igboResults.words;
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
