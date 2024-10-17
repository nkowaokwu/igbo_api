jest.mock('stripe');
import { requestFixture, responseFixture } from '../../__tests__/shared/fixtures';
import { postCheckoutSession, postPortalSession } from '../stripe';

describe('Credentials', () => {
  it('creates a new checkout session', async () => {
    const res = responseFixture();
    // @ts-expect-error Request fixture
    await postCheckoutSession(requestFixture(), res);

    expect(res.redirect).toHaveBeenCalledWith(303, 'checkout_session_url');
  });

  it('creates a new portal session', async () => {
    const res = responseFixture();
    // @ts-expect-error Request fixture
    await postPortalSession(requestFixture(), res);

    expect(res.redirect).toHaveBeenCalledWith(303, 'portal_session_url');
  });
});
