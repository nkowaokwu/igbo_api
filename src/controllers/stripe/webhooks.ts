import Stripe from 'stripe';
import { putDeveloperHelper } from '../developers';
import AccountStatus from '../../shared/constants/AccountStatus';
import Plan from '../../shared/constants/Plan';

interface Event {
  data: { object: Stripe.Subscription };
}

/**
 * Handles the event of creating a new customer subscription
 * @param event Subscription event
 */
export const handleCustomerSubscriptionCreated = async (event: Event) => {
  const {
    customer,
    metadata: { developerId, plan },
  } = event.data.object;

  await putDeveloperHelper({
    query: { _id: developerId },
    data: {
      stripeId: customer as string,
      plan: plan as Plan,
      accountStatus: AccountStatus.ACTIVE,
    },
  });
};

/**
 * Handles the event of deleting a customer subscription
 * @param event Subscription event
 */
export const handleCustomerSubscriptionDeleted = async (event: Event) => {
  const { customer, status } = event.data.object;

  await putDeveloperHelper({
    query: { stripeId: customer },
    data: { plan: Plan.STARTER, accountStatus: status },
  });
};

/**
 * Handles the event of pausing a customer subscription
 * @param event Subscription event
 */
export const handleCustomerSubscriptionPaused = async (event: Event) => {
  const { customer, status } = event.data.object;

  await putDeveloperHelper({
    query: { stripeId: customer },
    data: { accountStatus: status },
  });
};

/**
 * Handles the event of resuming a customer subscription
 * @param event Subscription event
 */
export const handleCustomerSubscriptionResumed = async (event: Event) => {
  const { customer, status } = event.data.object;

  await putDeveloperHelper({
    query: { stripeId: customer },
    data: { accountStatus: status },
  });
};

/**
 * Handles the event of updating a customer subscription
 * @param event Subscription event
 */
export const handleCustomerSubscriptionUpdated = async (event: Event) => {
  const { customer, status } = event.data.object;

  await putDeveloperHelper({
    query: { stripeId: customer },
    data: {
      accountStatus: status,
    },
  });
};
