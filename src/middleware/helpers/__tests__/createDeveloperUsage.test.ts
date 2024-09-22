import { Types } from 'mongoose';
import { createDeveloperUsage } from '../createDeveloperUsage';
import { documentId } from '../../../__tests__/shared/fixtures';
import { createDbConnection } from '../../../services/database';

jest.mock('../../../services/database');

const saveMock = jest.fn();
class DeveloperUsage {
  constructor() {
    return {
      save: saveMock,
    };
  }
}

describe('createDeveloperUsage', () => {
  it('creates a new developer usage document', async () => {
    const developerId = new Types.ObjectId(documentId);
    // @ts-expect-error mockReturnValue
    createDbConnection.mockReturnValue({ model: jest.fn(() => DeveloperUsage) });

    await createDeveloperUsage({ developerId: documentId });
    expect(saveMock).toHaveBeenCalled();
  });
});
