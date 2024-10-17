import authorizeCheckoutSession from '../authorizeCheckoutSession';
import {
  requestFixture,
  responseFixture,
  nextFunctionFixture,
} from '../../__tests__/shared/fixtures';

describe('authorizeCheckoutSession', () => {
  it('authorizes the current checkout session', async () => {
    const req = requestFixture({
      body: { developerId: 'developerId', lookupKey: 'lookupKey' },
    });
    const res = responseFixture();
    const next = nextFunctionFixture();
    await authorizeCheckoutSession(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('fails to authorize because malformed payload', async () => {
    const req = requestFixture({
      body: { developerId: 'developerId' },
    });
    const res = responseFixture();
    const next = nextFunctionFixture();
    await authorizeCheckoutSession(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
