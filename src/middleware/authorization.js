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
      throw new Error('Invalid API Key. Check your API Key and try again', 403);
    }
    req.locals.developer = developer;
    next();
    return;
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};
