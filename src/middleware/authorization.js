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

    // check if api key belongs to developer
    await findDeveloper(apiKey);

    return next();
  } catch (err) {
    let status = 400;
    if ('cause' in err) {
      status = err.cause;
    }
    return res.status(status).send({ error: err.message });
  }
};
