import Joi from 'joi';
import { MiddleWare } from '../types';

const developersJoiSchema = Joi.object().keys({
  firebaseId: Joi.string().required(),
  email: Joi.string().allow('', null).optional(),
  name: Joi.string().allow('', null).optional(),
});

const validateUpdateDeveloperBody: MiddleWare = (req, res, next) => {
  const { body: data } = req;

  const validationResult = developersJoiSchema.validate(data);
  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error.message });
  }

  return next();
};

export default validateUpdateDeveloperBody;
