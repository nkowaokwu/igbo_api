import { isDevelopment } from '../config';
import { handleRequest, FALLBACK_API_KEY, findDeveloper } from '../controllers/developers/utils';

export default async (req, res, next) => {
  try {
    let { apiToken: apiKey } = handleRequest(req);

    if (!apiKey && isDevelopment) {
      apiKey = FALLBACK_API_KEY;
    }

<<<<<<< HEAD
    // Check if API key belongs to the requested developer
    const developer = await findDeveloper(apiKey);

    if (developer.length < 1) {
      throw new Error('Invalid API Key. Check your API Key and try again', { cause: 403 });
    }
    req.developer = developer;
=======
    //   check if api key belongs to developer
    await findDeveloper(apiKey);

>>>>>>> 37f1104 (chore: fix up authorization middleware, update findDeveloper helper #627)
    return next();
  } catch (err) {
    let status = 400;
    if ('cause' in err) {
      status = err.cause;
    }
    return res.status(status).send({ error: err.message });
  }
};
