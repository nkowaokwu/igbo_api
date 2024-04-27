import { postCheckoutSession, postPortalSession, postWebhook } from './shared/commands';

jest.unmock('mongoose');

describe('Stripe', () => {
  describe('/POST Stripe Checkout', () => {
    it('redirect to checkout session', async () => {
      const res = await postCheckoutSession({ developerId: 'developerId', lookupKey: '123' });
      expect(res.status).toEqual(303);
      expect(res.headers.location).toEqual('checkout_session_url');
    });

    it('fail to redirect to checkout session missing developerId', async () => {
      // @ts-expect-error lookupKey
      const res = await postCheckoutSession({ lookupKey: '123' });
      expect(res.status).toEqual(400);
    });

    it('fail to redirect to checkout session missing lookupKey', async () => {
      // @ts-expect-error developerId
      const res = await postCheckoutSession({ developerId: '123' });
      expect(res.status).toEqual(400);
    });
  });
  describe('/POST Stripe Portal', () => {
    it('redirect to portal session', async () => {
      const res = await postPortalSession({ sessionId: 'sessionId' });
      expect(res.status).toEqual(303);
      expect(res.headers.location).toEqual('portal_session_url');
    });

    it('fail to redirect to portal session missing sessionId', async () => {
      // @ts-expect-error sessionId
      const res = await postCheckoutSession({});
      expect(res.status).toEqual(400);
    });
  });

  describe('/POST Stripe Webhook', () => {
    it('handle webhooks', async () => {
      const res = await postWebhook();
      console.log(res.body);
      expect(res.status).toEqual(200);
    });
  });
});
