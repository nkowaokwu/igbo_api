import createRegExp from '../../../shared/utils/createRegExp';
import { searchExamplesRegexQuery } from '../queries';
import { flagsFixture } from '../../../__tests__/shared/fixtures';
import { SuggestionSourceEnum } from '../../../shared/constants/SuggestionSourceEnum';

describe('queries', () => {
  it('creates a searchExamplesRegexQuery', () => {
    const regex = createRegExp('testing');
    const flags = flagsFixture();

    const query = searchExamplesRegexQuery({ regex, flags });
    expect(query.$and).toHaveLength(2);
    expect(query.$and[0].$or).toMatchObject([
      {
        'source.text': { $regex: /(\W|^)((t)([eEèéēÈÉĒ]+[´́`¯̣̄̀]{0,})(s)(t)(?:es|[sx]|ing)?)(\W|$)/i },
      },
      { 'translations.text': /(\W|^)((t)([eEèéēÈÉĒ]+[´́`¯̣̄̀]{0,})(s)(t)(?:es|[sx]|ing)?)(\W|$)/i },
    ]);
    expect(query.$and[1].$or).toEqual([
      { origin: { $exists: false } },
      { origin: { $eq: SuggestionSourceEnum.INTERNAL } },
    ]);
  });
});
