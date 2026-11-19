import { searchSchema } from '../../models/Search';
import CacheSourceEnum from '../../shared/constants/CacheSourceEnum';
import { createDbConnection, handleCloseConnection } from '../../services/database';
import removeAccents from '../../shared/utils/removeAccents';
import { Search } from '../../types';

type RecordSearchInput = Omit<Search, 'normalizedTerm' | 'cacheSource' | 'searchedAt'>;

const LETTER_REGEX = /\p{L}/u;
const EMAIL_REGEX = /\S+@\S+\.\S+/;
const LINK_REGEX = /^(https?:\/\/|www\.)/i;

const isRecordableTerm = (term: string) =>
  LETTER_REGEX.test(term) && !EMAIL_REGEX.test(term) && !LINK_REGEX.test(term);

const normalizeTerm = (term: string) =>
  removeAccents.removeTones(term.toLowerCase()).normalize('NFC').replace(/'/g, '’');

/* Saves a search unless the term is empty, has no letters, or is a link or email */
const recordSearch = async ({
  term,
  language,
  source,
  noResultsFound,
  isCached,
}: RecordSearchInput) => {
  const cleanedTerm = term.trim().replace(/\s+/g, ' ');
  if (!isRecordableTerm(cleanedTerm)) {
    return;
  }

  const connection = createDbConnection();
  const SearchModel = connection.model<Search>('Search', searchSchema);
  try {
    await new SearchModel({
      term: cleanedTerm,
      normalizedTerm: normalizeTerm(cleanedTerm),
      language,
      source,
      noResultsFound,
      isCached,
      ...(isCached ? { cacheSource: CacheSourceEnum.REDIS } : {}),
    }).save();
  } finally {
    await handleCloseConnection(connection);
  }
};

export default recordSearch;
