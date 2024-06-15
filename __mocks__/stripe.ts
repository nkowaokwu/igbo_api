class Stripe {
  apiKey = '';
  prices = {
    list: jest.fn(() => ({ data: [{ id: 'price_id' }] })),
  };
  checkout = {
    sessions: {
      create: jest.fn(() => ({ url: 'checkout_session_url' })),
      retrieve: jest.fn(() => ({ customer: 'checkout_session_customer' })),
    },
  };
  billingPortal = {
    sessions: {
      create: jest.fn(() => ({ url: 'portal_session_url' })),
    },
  };
  webhooks = {
    constructEvent: jest.fn(() => ({ object: {} })),
  };

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
}

export default Stripe;
