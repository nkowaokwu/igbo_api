import { API_ROUTE } from '../../config';
import Plan from '../../shared/constants/Plan';
import {
  handleCustomerSubscriptionCreated,
  handleCustomerSubscriptionDeleted,
  handleCustomerSubscriptionPaused,
  handleCustomerSubscriptionResumed,
  handleCustomerSubscriptionUpdated,
} from './webhooks';
import initializeStripe from '../../services/stripe';
import { MiddleWare } from '../../types';

const stripe = initializeStripe();

const productPlans: { [key: string]: Plan } = {
  igbo_api_team: Plan.TEAM,
};

export const postCheckoutSession: MiddleWare = async (req, res) => {
  const prices = await stripe.prices.list({
    lookup_keys: [req.body.lookupKey],
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
    metadata: {
      developerId: req.body.developerId,
      plan: productPlans[req.body.lookupKey],
    },
    mode: 'subscription',
    success_url: `${API_ROUTE}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${API_ROUTE}/?canceled=true`,
  });

  return res.redirect(303, session.url || '/');
};

export const postPortalSession: MiddleWare = async (req, res) => {
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

export const postWebhook: MiddleWare = async (req, res) => {
  const event = req.body;

  // Handle the event
  if (event.type === 'customer.subscription.created') {
    await handleCustomerSubscriptionCreated(event);
  } else if (event.type === 'customer.subscription.deleted') {
    await handleCustomerSubscriptionDeleted(event);
  } else if (event.type === 'customer.subscription.paused') {
    await handleCustomerSubscriptionPaused(event);
  } else if (event.type === 'customer.subscription.resumed') {
    await handleCustomerSubscriptionResumed(event);
  } else if (event.type === 'customer.subscription.updated') {
    await handleCustomerSubscriptionUpdated(event);
  } else {
    console.log(`Unhandled event type ${event.type}`);
  }

  return res.send();
};
