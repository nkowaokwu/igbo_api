import { postCheckoutSession, postPortalSession, postWebhook } from '..';
import {
  nextFunctionFixture,
  requestFixture,
  responseFixture,
} from '../../../__tests__/shared/fixtures';
import {
  handleCustomerSubscriptionCreated,
  handleCustomerSubscriptionDeleted,
  handleCustomerSubscriptionPaused,
  handleCustomerSubscriptionResumed,
  handleCustomerSubscriptionUpdated,
} from '../webhooks';

jest.mock('stripe');
jest.mock('../webhooks');

describe('stripe', () => {
  it('posts checkout session', async () => {
    const res = responseFixture();
    await postCheckoutSession(requestFixture(), res, nextFunctionFixture());
    expect(res.redirect).toHaveBeenCalledWith(303, 'checkout_session_url');
  });

  it('posts portal session', async () => {
    const res = responseFixture();
    await postPortalSession(requestFixture(), res, nextFunctionFixture());
    expect(res.redirect).toHaveBeenCalledWith(303, 'portal_session_url');
  });

  describe('Webhooks', () => {
    it('handles customer subscription created event', async () => {
      const event = { type: 'customer.subscription.created' };
      const res = responseFixture();
      await postWebhook(requestFixture({ body: event }), res, nextFunctionFixture());
      expect(handleCustomerSubscriptionCreated).toHaveBeenCalledWith(event);
    });

    it('handles customer subscription deleted event', async () => {
      const event = { type: 'customer.subscription.deleted' };
      const res = responseFixture();
      await postWebhook(requestFixture({ body: event }), res, nextFunctionFixture());
      expect(handleCustomerSubscriptionDeleted).toHaveBeenCalledWith(event);
    });

    it('handles customer subscription paused event', async () => {
      const event = { type: 'customer.subscription.paused' };
      const res = responseFixture();
      await postWebhook(requestFixture({ body: event }), res, nextFunctionFixture());
      expect(handleCustomerSubscriptionPaused).toHaveBeenCalledWith(event);
    });

    it('handles customer subscription resumed event', async () => {
      const event = { type: 'customer.subscription.resumed' };
      const res = responseFixture();
      await postWebhook(requestFixture({ body: event }), res, nextFunctionFixture());
      expect(handleCustomerSubscriptionResumed).toHaveBeenCalledWith(event);
    });

    it('handles customer subscription updated event', async () => {
      const event = { type: 'customer.subscription.updated' };
      const res = responseFixture();
      await postWebhook(requestFixture({ body: event }), res, nextFunctionFixture());
      expect(handleCustomerSubscriptionUpdated).toHaveBeenCalledWith(event);
    });
  });
});
