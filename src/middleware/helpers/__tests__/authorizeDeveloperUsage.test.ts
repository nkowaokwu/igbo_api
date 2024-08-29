import { authorizeDeveloperUsage } from '../authorizeDeveloperUsage';
import {
  developerFixture,
  developerUsageFixture,
  documentId,
} from '../../../__tests__/shared/fixtures';
import { findDeveloperUsage } from '../findDeveloperUsage';
import { createDeveloperUsage } from '../createDeveloperUsage';
import ApiType from '../../../shared/constants/ApiType';
import ApiUsageLimit from '../../../shared/constants/ApiUsageLimit';

jest.mock('../findDeveloperUsage');
jest.mock('../createDeveloperUsage');

describe('authorizeDeveloperUsage', () => {
  it("authorizes the current developer's usage", async () => {
    const route = 'speech-to-text';
    const developer = developerFixture({});
    const developerUsage = developerUsageFixture({});
    // @ts-expect-error mockReturnValue
    findDeveloperUsage.mockReturnValue({
      ...developerUsage,
      save: jest.fn(() => developerUsage),
      markModified: jest.fn(),
    });

    // @ts-expect-error developer
    const res = await authorizeDeveloperUsage({ route, developer });
    expect(res).toEqual(developerUsage);
  });

  it("updates the current developer's usage", async () => {
    const route = 'speech-to-text';
    const developer = developerFixture({});
    const developerUsage = developerUsageFixture({});
    const developerUsageDocument = {
      ...developerUsage,
      save: jest.fn(() => developerUsage),
      markModified: jest.fn(),
    };
    // @ts-expect-error mockReturnValue
    findDeveloperUsage.mockReturnValue(developerUsageDocument);

    // @ts-expect-error developer
    await authorizeDeveloperUsage({ route, developer });
    expect(developerUsageDocument.usage.count).toEqual(1);
  });

  it('creates a fallback developer usage if none exist exclusively for Igbo API', async () => {
    const route = 'igbo_api';
    const developer = developerFixture({ id: documentId });
    const developerUsage = developerUsageFixture({});
    const developerUsageDocument = {
      ...developerUsage,
      save: jest.fn(() => developerUsage),
      markModified: jest.fn(),
    };
    // @ts-expect-error mockReturnValue
    findDeveloperUsage.mockReturnValue(undefined);
    // @ts-expect-error mockReturnValue
    createDeveloperUsage.mockReturnValue(developerUsageDocument);
    // @ts-expect-error developer
    await authorizeDeveloperUsage({ route, developer });
    expect(createDeveloperUsage).toHaveBeenCalled();
  });

  it('throws error unable finding developer usage', async () => {
    const route = 'speech-to-text';
    const developer = developerFixture({});
    // @ts-expect-error mockReturnValue
    findDeveloperUsage.mockReturnValue(undefined);

    // @ts-expect-error developer
    authorizeDeveloperUsage({ route, developer }).catch((err) => {
      expect(err.message).toEqual('No developer usage found');
    });
  });

  it('throws error due to exceeding usage limit', async () => {
    const route = 'speech-to-text';
    const developer = developerFixture({});
    const developerUsage = developerUsageFixture({
      usage: { date: new Date(), count: ApiUsageLimit[ApiType.SPEECH_TO_TEXT] + 1 },
    });
    // @ts-expect-error mockReturnValue
    findDeveloperUsage.mockReturnValue({
      ...developerUsage,
      save: jest.fn(() => developerUsage),
      markModified: jest.fn(),
    });

    // @ts-expect-error developer
    authorizeDeveloperUsage({ route, developer }).catch((err) => {
      expect(err.message).toEqual('You have exceeded your limit for this API for the day.');
    });
  });
});
