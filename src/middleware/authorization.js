import { isDevelopment } from '../config';
import { FALLBACK_API_KEY, fetchAPIKey, findDeveloper } from '../shared/constants/DeveloperUtils';

export default async (req, res, next) => {
  try {
    // const { apiLimit } = req.query;
    let apiKey = fetchAPIKey(req);

    if (!apiKey && isDevelopment) {
      apiKey = FALLBACK_API_KEY;
    }

    //   check if api key belongs to developer
    await findDeveloper(apiKey);

    return next();
  } catch (err) {
    res.status(400);
    return res.send({ error: err.message });
  }
};
