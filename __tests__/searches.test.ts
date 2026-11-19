import { searchSchema } from '../src/models/Search';
import { createDbConnection, handleCloseConnection } from '../src/services/database';
import LanguageEnum from '../src/shared/constants/LanguageEnum';
import SearchSourceEnum from '../src/shared/constants/SearchSourceEnum';
import { Search } from '../src/types';
import { getWords } from './shared/commands';
import { MAIN_KEY } from './shared/constants';

jest.unmock('mongoose');

const findSearches = async (normalizedTerm: string) => {
  const connection = createDbConnection();
  const SearchModel = connection.model<Search>('Search', searchSchema);
  const searches = await SearchModel.find({ normalizedTerm }).sort({ searchedAt: -1 }).lean();
  await handleCloseConnection(connection);
  return searches;
};

describe('Search tracking', () => {
  it('record a developer search that found results', async () => {
    const before = await findSearches('adu');
    const res = await getWords({ keyword: 'àdù' }, {});
    expect(res.status).toEqual(200);
    const after = await findSearches('adu');
    expect(after).toHaveLength(before.length + 1);
    expect(after[0]).toMatchObject({
      term: 'àdù',
      normalizedTerm: 'adu',
      language: LanguageEnum.IGBO,
      source: SearchSourceEnum.IGBO_API,
      noResultsFound: false,
    });
  });

  it('record a website search that found no results', async () => {
    const before = await findSearches('zqxwvbn');
    const res = await getWords({ keyword: 'zqxwvbn' }, { apiKey: MAIN_KEY });
    expect(res.status).toEqual(200);
    const after = await findSearches('zqxwvbn');
    expect(after).toHaveLength(before.length + 1);
    expect(after[0]).toMatchObject({
      source: SearchSourceEnum.NKOWAOKWU,
      noResultsFound: true,
    });
  });

  it('not record a search for a later page', async () => {
    const before = await findSearches('adu');
    const res = await getWords({ keyword: 'àdù', page: 1 }, {});
    expect(res.status).toEqual(200);
    const after = await findSearches('adu');
    expect(after).toHaveLength(before.length);
  });
});
