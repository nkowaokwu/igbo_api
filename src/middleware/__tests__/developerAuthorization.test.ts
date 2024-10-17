import * as admin from 'firebase-admin';
import developerAuthorization from '../developerAuthorization';
import {
  requestFixture,
  responseFixture,
  nextFunctionFixture,
  statusSendMock,
} from '../../__tests__/shared/fixtures';

jest.mock('firebase-admin');

describe('developerAuthorization', () => {
  it('authorizes the developer with Firebase', async () => {
    // @ts-expect-error Auth
    jest.spyOn(admin, 'auth').mockImplementation(() => ({
      verifyIdToken: () => ({ uid: 'authorization', email: 'testing@email.com' }),
    }));
    const req = requestFixture({
      params: { id: 'authorization' },
      headers: { authorization: 'Bearer authorization' },
    });
    const res = responseFixture();
    const next = nextFunctionFixture();
    await developerAuthorization(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('fails to authorize because malformed authorization header', async () => {
    const req = requestFixture({
      params: { id: 'authorization' },
      headers: { authorization: 'authorization' },
    });
    const res = responseFixture();
    const next = nextFunctionFixture();
    await developerAuthorization(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(statusSendMock).toHaveBeenCalledWith({
      error: 'Incorrectly formatted authorization header.',
    });
  });

  it('req params id does not match decoded user uid', async () => {
    const req = requestFixture({
      params: { id: 'different-authorization' },
      headers: { authorization: 'Bearer authorization' },
    });
    const res = responseFixture();
    const next = nextFunctionFixture();
    await developerAuthorization(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
    expect(statusSendMock).toHaveBeenCalledWith({
      error: 'Unable to access this resource.',
    });
  });
});
