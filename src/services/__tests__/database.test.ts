import { createDbConnection, handleCloseConnection } from '../database';
import { closeMock, modelMock } from '../../../__mocks__/mongoose';

describe('database', () => {
  it('connects to the database', () => {
    const connection = createDbConnection();
    expect(connection).toEqual({ readyState: 1, close: closeMock, model: modelMock });
  });

  it('disconnects from the database', async () => {
    // @ts-expect-error connection
    await handleCloseConnection({ readyState: 1, close: closeMock });
    expect(closeMock).toHaveBeenCalled();
  });
});
