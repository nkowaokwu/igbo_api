import { Router } from 'express';
import { postCheckoutSession, postPortalSession, postWebhook } from '../controllers/stripe';
import validateStripeSignature from '../middleware/validateStripeSignature';
import authorizeCheckoutSession from '../middleware/authorizeCheckoutSession';
import authorizePortalSession from '../middleware/authorizePortalSession';

const router = Router();

router.post('/checkout', authorizeCheckoutSession, postCheckoutSession);
router.post('/portal', authorizePortalSession, postPortalSession);
router.post('/webhook', validateStripeSignature, postWebhook);

export default router;
