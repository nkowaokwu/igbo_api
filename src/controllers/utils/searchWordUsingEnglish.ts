import { RedisClientType } from 'redis';
import Version from '../../shared/constants/Version';
import { findWordsWithMatch } from './buildDocs';
import { sortDocsBy } from './sortDocsBy';
import { searchEnglishRegexQuery } from './queries';
import { getCachedWords, setCachedWords } from '../../APIs/RedisAPI';
import { handleWordFlags } from '../../APIs/FlagsAPI';
import { SearchRegExp } from '../../shared/utils/createRegExp';

type EnglishSearch = {
  redisClient: RedisClientType | undefined;
  version: Version;
  regex: SearchRegExp;
  searchWord: string;
  skip: number;
  limit: number;
  flags: {
    examples: boolean;
    dialects: boolean;
    resolve: boolean;
  };
  filters: any;
};

/* Searches for word with English stored in MongoDB */
const searchWordUsingEnglish = async ({
  redisClient,
  version,
  regex,
  searchWord,
  skip,
  limit,
  flags,
  filters,
}: EnglishSearch) => {
  console.time(`searchWordUsingEnglish for ${searchWord}`);
  let responseData = { words: [], contentLength: 0 };
  const redisWordsCacheKey = `"${searchWord}"-${version}`;
  const cachedWords = await getCachedWords({ key: redisWordsCacheKey, redisClient });

  if (cachedWords) {
    console.log('Return words from cache for English search');
    responseData = {
      words: cachedWords.words,
      contentLength: cachedWords.contentLength,
    };
  } else {
    const query = searchEnglishRegexQuery({ regex, searchWord, filters });
    console.time(`Searching English words for ${searchWord}`);
    const { words, contentLength } = await findWordsWithMatch({ match: query, version });
    console.timeEnd(`Searching English words for ${searchWord}`);
    responseData = await setCachedWords({
      key: redisWordsCacheKey,
      data: { words, contentLength },
      redisClient,
      version,
    });
  }

  const sortKey = version === Version.VERSION_1 ? 'definitions[0]' : 'definitions[0].definitions[0]';
  let sortedWords = sortDocsBy(searchWord, responseData.words, sortKey, version, regex);
  sortedWords = sortedWords.slice(skip, skip + limit);

  console.timeEnd(`searchWordUsingEnglish for ${searchWord}`);
  return handleWordFlags({
    data: { words: sortedWords, contentLength: responseData.contentLength },
    flags,
  });
};

export default searchWordUsingEnglish;
