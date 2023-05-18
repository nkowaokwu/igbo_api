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
      const error = {
        status: 403,
        message: 'Invalid API Key. Check your API Key and try again!',
      };
      return res.status(error.status).send({
        status: error.status,
        message: error.message,
      });
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
};
