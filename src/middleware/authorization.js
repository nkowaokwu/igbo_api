import { isDevelopment } from '../config';
import { FALLBACK_API_KEY, fetchAPIKey, findDeveloper } from '../controllers/developers';

export default async (req, res, next) => {
  try {
    let apiKey = fetchAPIKey(req);

    if (!apiKey && isDevelopment) {
      apiKey = FALLBACK_API_KEY;
    }

    // Check if API key belongs to the requested developer
    await findDeveloper(apiKey);

    return next();
  } catch (err) {
    res
      .status(400)
      .send({ error: err.message });
  }
};
