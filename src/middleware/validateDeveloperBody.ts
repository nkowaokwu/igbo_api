import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';

const developersJoiSchema = Joi.object().keys({
  name: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
});

export default (req: Request, res: Response, next: NextFunction) => {
  const { body: data } = req;

  const validationResult = developersJoiSchema.validate(data);
  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error.message });
  }

  return next();
};
