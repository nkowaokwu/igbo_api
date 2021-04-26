import Joi from 'joi';

const developersJoiSchema = Joi.object().keys({
  name: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
});

export default (req, res, next) => {
  const { body: data } = req;

  const validationResult = developersJoiSchema.validate(data);
  if (validationResult.error) {
    return res.send({ error: validationResult.error.message });
  }

  return next();
};
