import { findDeveloperUsage } from '../findDeveloperUsage';
import ApiType from '../../../shared/constants/ApiType';
import { createDbConnection } from '../../../services/database';

jest.mock('../../../services/database');

describe('findDeveloperUsage', () => {
  it('finds a specific developer usage', async () => {
    const developerId = 'developerId';
    const findOneMock = jest.fn(() => ({ id: developerId }));
    // @ts-expect-error mockReturnValue
    createDbConnection.mockReturnValue({
      model: jest.fn(() => ({
        findOne: findOneMock,
      })),
    });

    const res = await findDeveloperUsage({ developerId, usageType: ApiType.DICTIONARY });
    expect(res).toEqual({ id: developerId });
    expect(findOneMock).toHaveBeenCalledWith({ developerId, usageType: ApiType.DICTIONARY });
  });

  it('returns undefined if no developer usage is found', async () => {
    const developerId = 'developerId';
    const findOneMock = jest.fn(() => undefined);
    // @ts-expect-error mockReturnValue
    createDbConnection.mockReturnValue({
      model: jest.fn(() => ({
        findOne: findOneMock,
      })),
    });

    const res = await findDeveloperUsage({ developerId, usageType: ApiType.DICTIONARY });
    expect(res).toEqual(undefined);
    expect(findOneMock).toHaveBeenCalledWith({ developerId, usageType: ApiType.DICTIONARY });
  });
});
