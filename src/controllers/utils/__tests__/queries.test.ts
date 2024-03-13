import createRegExp from '../../../shared/utils/createRegExp';
import { searchExamplesRegexQuery } from '../queries';
import { flagsFixture } from '../../../../__tests__/shared/fixtures';
import { SuggestionSourceEnum } from '../../../shared/constants/SuggestionSourceEnum';

describe('queries', () => {
  it('creates an searchExamplesRegexQuery', () => {
    const regex = createRegExp('testing');
    const flags = flagsFixture();

    const query = searchExamplesRegexQuery({ regex, flags });
    expect(query.$and).toHaveLength(2);
    expect(query.$and[0].$or).toBeDefined();
    expect(query.$and[1].$or).toEqual([
      { source: { $exists: false } },
      { source: { $eq: SuggestionSourceEnum.INTERNAL } },
    ]);
  });
});
