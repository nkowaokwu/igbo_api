import Stripe from 'stripe';

enum AccountStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  INCOMPLETE = 'incomplete',
  INCOMPLETE_EXPIRED = 'incomplete_expired',
  TRIALING = 'trialing',
  PAST_DUE = 'past_due',
  CANCELED = 'canceled',
  UNPAID = 'unpaid',
}

export type Status = AccountStatus | Stripe.Subscription.Status;

export default AccountStatus;
