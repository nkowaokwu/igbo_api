import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '../config';

/**
 * Initializes a Stripe instance
 * @returns A Stripe instance
 */
const initializeStripe = () =>
  new Stripe(STRIPE_SECRET_KEY, {
    typescript: true,
  });

export default initializeStripe;
