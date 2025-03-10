import { MAIN_KEY, isDevelopment, isProduction } from '../config';
import { MiddleWare } from '../types';
import { authorizeDeveloperUsage } from './helpers/authorizeDeveloperUsage';
import { findDeveloper } from './helpers/findDeveloper';

const FALLBACK_API_KEY = 'fallback_api_key';

const validateApiKey: MiddleWare = async (req, res, next) => {
  try {
    console.log('Validating API key');
    let apiKey = (req.headers['X-API-Key'] || req.headers['x-api-key']) as string;

    /* Official sites can bypass validation */
    if (apiKey === MAIN_KEY) {
      req.isUsingMainKey = true;
      return next();
    }
    req.isUsingMainKey = false;

    if (!apiKey && isDevelopment) {
      apiKey = FALLBACK_API_KEY;
    }
    if (!apiKey) {
      throw new Error("X-API-Key Header doesn't exist");
    }

    /* While in development or testing, using the FALLBACK_API_KEY will grant access */
    if (apiKey === FALLBACK_API_KEY && !isProduction) {
      return next();
    }

    const developer = await findDeveloper(apiKey);

    if (!developer) {
      return res.status(401).send({ error: 'Your API key is invalid' });
    }

    await authorizeDeveloperUsage({ path: req.route.path, developer });

    return next();
  } catch (err: any) {
    res.status(400);
    return res.send({ error: err.message });
  }
};

export default validateApiKey;
