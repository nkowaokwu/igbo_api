import initializeStripe from '../stripe';
import Stripe from '../../../__mocks__/stripe';

jest.mock('stripe');

describe('stripe service', () => {
  it('initializes stripe', async () => {
    const stripe = initializeStripe();
    expect(stripe).toBeInstanceOf(Stripe);
  });
});
