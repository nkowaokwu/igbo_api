import Versions from '../../shared/constants/Versions';
import { findWordsWithMatch } from './buildDocs';
import { sortDocsBy } from '.';
import { searchEnglishRegexQuery } from './queries';

/* Searches for word with English stored in MongoDB */
const searchWordUsingEnglish = async ({
  searchWord,
  filteringParams,
  version,
  regex,
  skip,
  limit,
  ...rest
}) => {
  const query = searchEnglishRegexQuery({ regex, searchWord, filteringParams });
  console.time(`Searching English words for ${searchWord}`);
  const { words, contentLength } = await findWordsWithMatch({ match: query, version, ...rest });
  const sortKey = version === Versions.VERSION_1 ? 'definitions[0]' : 'definitions[0].definitions[0]';
  let sortedWords = sortDocsBy(searchWord, words, sortKey, version, regex);
  sortedWords = sortedWords.slice(skip, skip + limit);
  console.timeEnd(`Searching English words for ${searchWord}`);
  return { words: sortedWords, contentLength };
};

export default searchWordUsingEnglish;
