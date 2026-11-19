import CacheSourceEnum from '../shared/constants/CacheSourceEnum';
import LanguageEnum from '../shared/constants/LanguageEnum';
import SearchSourceEnum from '../shared/constants/SearchSourceEnum';

export interface Search {
  term: string;
  normalizedTerm: string;
  language: LanguageEnum.ENGLISH | LanguageEnum.IGBO;
  source: SearchSourceEnum;
  noResultsFound: boolean;
  isCached: boolean;
  cacheSource?: CacheSourceEnum;
  searchedAt: Date;
}
