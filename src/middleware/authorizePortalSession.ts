import Joi from 'joi';
import { MiddleWare } from '../types';

const portalSession = Joi.object().keys({
  sessionId: Joi.string().required(),
});

const authorizePortalSession: MiddleWare = async (req, res, next) => {
  const { body: data } = req;

  const validationResult = portalSession.validate(data);
  if (validationResult.error) {
    return res.status(400).send({ error: validationResult.error.message });
  }

  return next();
};

export default authorizePortalSession;
