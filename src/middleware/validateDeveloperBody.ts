import Joi from 'joi';
import { MiddleWare } from '../types';

const developersJoiSchema = Joi.object().keys({
  name: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
});

const validateDeveloperBody: MiddleWare = (req, res, next) => {
  const { body: data } = req;

  const validationResult = developersJoiSchema.validate(data);
  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error.message });
  }

  return next();
};

export default validateDeveloperBody;
