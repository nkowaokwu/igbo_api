import { developerSchema } from '../../models/Developer';
import { createDbConnection } from '../../services/database';
import { isTest } from '../../config';

const PROD_LIMIT = 2500;
export const FALLBACK_API_KEY = 'fallback_api_key';

const determineLimit = (apiLimit) => (isTest ? apiLimit || PROD_LIMIT : PROD_LIMIT);

export const handleRequest = (req) => {
  const { apiLimit } = req.query;
  const apiToken = req.headers['X-API-Key'] || req.headers['x-api-key'];

  return { apiLimit, apiToken };
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

/* Finds a developer with provided information */
export const findDeveloper = async (apiKey) => {
  console.time('Finding developer account');
  const connection = createDbConnection();
  const Developer = connection.model('Developer', developerSchema);
  const developer = await Developer.find({ apiKey });
  if (!developer) {
    throw new Error('Invalid API Key. Check your API Key and try again');
  }
  console.timeEnd('Finding developer account');
  return developer;
};

export const checkDeveloperAPIKey = async (apiLimit, apiKey, next) => {
  const developer = await findDeveloper(apiKey);

  if (developer) {
    console.log(determineLimit(apiLimit));
    if (developer.usage.count >= determineLimit(apiLimit)) {
      throw new Error('You have exceeded your API limit. Please upgrade your plan.', 403);
    }
    await handleDeveloperUsage(developer);
    return next();
  }

  throw new Error('Invalid API Key. Check your API Key and try again', 401);
};
