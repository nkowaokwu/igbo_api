import authorizePortalSession from '../authorizePortalSession';
import {
  requestFixture,
  responseFixture,
  nextFunctionFixture,
} from '../../__tests__/shared/fixtures';

describe('authorizePortalSession', () => {
  it('authorizes the current portal session', async () => {
    const req = requestFixture({
      body: { sessionId: 'sessionId' },
    });
    const res = responseFixture();
    const next = nextFunctionFixture();
    await authorizePortalSession(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('fails to authorize because malformed payload', async () => {
    const req = requestFixture({
      body: {},
    });
    const res = responseFixture();
    const next = nextFunctionFixture();
    await authorizePortalSession(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
