import { MAIN_KEY, isProduction } from '../config';
import { MiddleWare } from '../types';

const validateAdminApiKey: MiddleWare = async (req, res, next) => {
  try {
    const apiKey = req.headers['X-API-Key'] || req.headers['x-api-key'];

    if (isProduction && apiKey !== MAIN_KEY) {
      return res.status(403).send({ error: 'You do not have permission to view this resource' });
    }

    return next();
  } catch (err: any) {
    res.status(400);
    return res.send({ error: err.message });
  }
};

export default validateAdminApiKey;
