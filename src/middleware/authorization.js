import { isDevelopment } from '../config';
import { FALLBACK_API_KEY, fetchAPIKey, findDeveloper } from '../shared/constants/DeveloperUtils';

export default async (req, res, next) => {
  try {
    // const { apiLimit } = req.query;
    let apiKey = fetchAPIKey(req);

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
};
