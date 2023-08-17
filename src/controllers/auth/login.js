import { isTest } from '../../config';

export const login = (req, res, next) => {
  try {
    return res.status(200).send({
      message: 'Logging in...',
    });
  } catch (error) {
    if (!isTest) {
      console.trace(error);
    }
    return next(error);
  }
};
