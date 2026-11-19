import { Model, closeMock, modelMock } from '../../../../__mocks__/mongoose';
import LanguageEnum from '../../../shared/constants/LanguageEnum';
import SearchSourceEnum from '../../../shared/constants/SearchSourceEnum';
import { Search } from '../../../types';
import recordSearch from '../recordSearch';

const savedRows: object[] = [];

class SearchModelMock extends Model {
  constructor(value: object) {
    super(value);
    savedRows.push(value);
  }
}

const baseSearch: Pick<Search, 'language' | 'source' | 'noResultsFound'> = {
  language: LanguageEnum.IGBO,
  source: SearchSourceEnum.NKOWAOKWU,
  noResultsFound: true,
};

describe('recordSearch', () => {
  beforeEach(() => {
    savedRows.length = 0;
    modelMock.mockReturnValue(SearchModelMock);
  });

  it('saves the cleaned term and its normalized form', async () => {
    await recordSearch({ ...baseSearch, term: "  Ṅ̀kịta  n'Ụ́lọ " });
    expect(savedRows).toEqual([
      {
        ...baseSearch,
        term: "Ṅ̀kịta n'Ụ́lọ",
        normalizedTerm: 'ṅkịta n’ụlọ',
      },
    ]);
    expect(closeMock).toHaveBeenCalled();
  });

  it.each(['', '   ', '123', '???', 'ada@gmail.com', 'https://igboapi.com', 'www.google.com'])(
    'does not save %p',
    async (term: string) => {
      await recordSearch({ ...baseSearch, term });
      expect(savedRows).toEqual([]);
    }
  );
});
