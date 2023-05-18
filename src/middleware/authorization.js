import { isDevelopment } from '../config';
import { fetchAPIKey, FALLBACK_API_KEY, findDeveloper } from '../controllers/developers/utils';

export default async (req, res, next) => {
  try {
    let apiKey = fetchAPIKey(req);
    console.log('API Key:', apiKey);

    if (!apiKey && isDevelopment) {
      apiKey = FALLBACK_API_KEY;
    }

    // Check if API key belongs to the requested developer
    await findDeveloper(apiKey);

    next();
    return;
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};
