import { MiddleWare } from '../types';
import { STRIPE_ENDPOINT_SECRET } from '../config';
import initializeStripe from '../services/stripe';
import getErrorMessage from '../shared/utils/getErrorMessage';

const stripe = initializeStripe();

/**
 * Validates the Stripe signature to handle subsequent Webhooks
 * @param req
 * @param res
 * @param next
 * @returns
 */
const validateStripeSignature: MiddleWare = async (req, res, next) => {
  const endpointSecret = STRIPE_ENDPOINT_SECRET;

  if (endpointSecret) {
    const signature = req.headers['stripe-signature'] || '';

    try {
      req.body.event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
      return next();
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, getErrorMessage(err));
      return res.status(400).send('Stripe signature verification failed');
    }
  }

  return res.status(400).send({ message: 'Invalid Stripe signature' });
};

export default validateStripeSignature;
