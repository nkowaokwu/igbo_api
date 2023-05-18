import {
  MAIN_KEY,
  isDevelopment,
  isProduction,
} from '../config';
import {
  handleRequest,
  FALLBACK_API_KEY,
  checkDeveloperAPIKey,
  findDeveloper,
} from '../controllers/developers/utils';

export default async (req, res, next) => {
  try {
    let { apiToken: apiKey, apiLimit } = handleRequest(req);
    apiLimit = 2500;

    /* Official sites can bypass validation */
    if (apiKey === MAIN_KEY) {
      req.isUsingMainKey = true;
      return next();
    }
    req.isUsingMainKey = false;

    if (!apiKey && isDevelopment) {
      apiKey = FALLBACK_API_KEY;
    }

    /* While in development or testing, using the FALLBACK_API_KEY will grant access */
    if (apiKey === FALLBACK_API_KEY && !isProduction) {
      return next();
    }

    await findDeveloper(apiKey);

    await checkDeveloperAPIKey(apiLimit, apiKey, next);
    return next();
  } catch (err) {
    res.status(400);
    return res.send({ error: err.message });
  }
};
