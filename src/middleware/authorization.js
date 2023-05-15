<<<<<<< HEAD
<<<<<<< HEAD
import { isDevelopment } from '../config';
import { handleRequest, FALLBACK_API_KEY, findDeveloper } from '../controllers/developers/utils';

export default async (req, res, next) => {
  try {
    let { apiToken: apiKey } = handleRequest(req);

    if (!apiKey && isDevelopment) {
      apiKey = FALLBACK_API_KEY;
    }

    // Check if API key belongs to the requested developer
    const developer = await findDeveloper(apiKey);

    if (developer.length < 1) {
      throw new Error('Invalid API Key. Check your API Key and try again', { cause: 403 });
    }
    req.developer = developer;
    return next();
  } catch (err) {
    let status = 400;
    if ('cause' in err) {
      status = err.cause;
    }
    return res.status(status).send({ error: err.message });
  }
=======
import { fetchAPIKey, findDeveloper } from '../shared/constants/DeveloperUtils';
=======
import { isDevelopment } from '../config';
import { FALLBACK_API_KEY, fetchAPIKey, findDeveloper } from '../shared/constants/DeveloperUtils';
>>>>>>> d8994ba (add authorization middleware  #627)

export default async (req, res, next) => {
  try {
    // const { apiLimit } = req.query;
    let apiKey = fetchAPIKey(req);

<<<<<<< HEAD
  const developer = await findDeveloper(apiKey);
>>>>>>> dff17ab (chore: add developer function helpers, update validateApiKey middleware #627)
=======
    if (!apiKey && isDevelopment) {
      apiKey = FALLBACK_API_KEY;
    }

    const developer = await findDeveloper(apiKey);

    if (!developer) {
      throw new Error('Developer account not found');
    }

    //   check if api key belongs to developer
    if (developer.apiKey !== apiKey) {
      throw new Error('Invalid API Key. Check your API Key and try again');
    }

    return next();
  } catch (err) {
    res.status(400);
    return res.send({ error: err.message });
  }
>>>>>>> d8994ba (add authorization middleware  #627)
};
