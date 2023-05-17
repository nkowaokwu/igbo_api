import { developerSchema } from '../../models/Developer';
import { createDbConnection } from '../../services/database';
import { isTest } from '../../config';

const PROD_LIMIT = 2500;
export const FALLBACK_API_KEY = 'fallback_api_key';

const determineLimit = (apiLimit) => (isTest ? apiLimit || PROD_LIMIT : PROD_LIMIT);
export const fetchRequestQuery = (req) => {
  const { apiLimit } = req.query;
  return apiLimit;
};

const isSameDate = (first, second) => (
  first.getFullYear() === second.getFullYear()
    && first.getMonth() === second.getMonth()
    && first.getDate() === second.getDate()
);

/* Increments usage count and updates usage date */
const handleDeveloperUsage = async (developer) => {
  const updatedDeveloper = developer;
  const isNewDay = !isSameDate(updatedDeveloper.usage.date, new Date());
  updatedDeveloper.usage.date = Date.now();

  if (isNewDay) {
    updatedDeveloper.usage.count = 0;
  } else {
    updatedDeveloper.usage.count += 1;
  }

  return updatedDeveloper.save();
};

export const fetchAPIKey = (req) => {
  const apiKey = req.headers['X-API-Key'] || req.headers['x-api-key'];
  if (!apiKey) {
    throw new Error("X-API-Key Header doesn't exist");
  }
  return apiKey;
};

/* Finds a developer with provided information */
export const findDeveloper = async (apiKey) => {
  console.time('Finding developer account');
  const connection = createDbConnection();
  const Developer = connection.model('Developer', developerSchema);
  const developer = await Developer.find({ apiKey });
  if (!developer.length) {
    throw new Error('Invalid API Key. Check your API Key and try again');
  }
  console.timeEnd('Finding developer account');
  return developer;
};

export const checkDeveloperAPIKey = async (req, res, next) => {
  const { apiLimit } = fetchRequestQuery(req);
  const apiKey = fetchAPIKey(req);
  const developer = await findDeveloper(apiKey);

  if (developer) {
    if (developer.usage.count >= determineLimit(apiLimit)) {
      res.status(403);
      return res.send({ error: 'You have exceeded your limit of requests for the day' });
    }
    await handleDeveloperUsage(developer);
    return next();
  }

  throw new Error('Invalid API Key. Check your API Key and try again', 401);
};
