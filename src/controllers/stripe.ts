import { Request, Response } from 'express';
import Stripe from 'stripe';
import { API_ROUTE } from '../config';

const STRIPE_SECRET_KEY = 'sk_test_hpwuITjteocLizB8Afq7H3cV00FEEViC1s';
const stripe = new Stripe(STRIPE_SECRET_KEY);

export const postCheckoutSession = async (req: Request, res: Response) => {
  const prices = await stripe.prices.list({
    lookup_keys: [req.body.lookup_key],
    expand: ['data.product'],
  });

  const session = await stripe.checkout.sessions.create({
    billing_address_collection: 'auto',
    line_items: [
      {
        price: prices.data[0].id,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${API_ROUTE}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${API_ROUTE}/?canceled=true`,
  });

  return res.redirect(303, session.url || '/');
};

export const postPortalSession = async (req: Request, res: Response) => {
  const { sessionId } = req.body;
  const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

  if (!checkoutSession.customer) {
    throw new Error('No associated customer with checkout session');
  }

  const returnUrl = API_ROUTE;

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: `${checkoutSession.customer}`,
    return_url: returnUrl,
  });

  return res.redirect(303, portalSession.url);
};
