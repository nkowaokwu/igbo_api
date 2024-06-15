import Joi from 'joi';
import { MiddleWare } from '../types';

const checkoutSession = Joi.object().keys({
  developerId: Joi.string().required(),
  lookupKey: Joi.string().required(),
});

const authorizeCheckoutSession: MiddleWare = async (req, res, next) => {
  const { body: data } = req;

  const validationResult = checkoutSession.validate(data);
  if (validationResult.error) {
    return res.status(400).send({ error: validationResult.error.message });
  }

  return next();
};

export default authorizeCheckoutSession;
