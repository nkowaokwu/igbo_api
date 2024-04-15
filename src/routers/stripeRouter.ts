import { Router } from 'express';
import { postCheckoutSession, postPortalSession } from '../controllers/stripe';

const router = Router();

router.post('/checkout', postCheckoutSession);
router.post('/portal', postPortalSession);

export default router;
