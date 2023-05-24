import { compareSync } from 'bcrypt';
import { developerSchema } from '../../models/Developer';
import { createDbConnection } from '../../services/database';
import { PROD_LIMIT, isTest } from '../../config';

export const FALLBACK_API_KEY = 'fallback_api_key';

const determineLimit = (apiLimit) => (isTest ? apiLimit || PROD_LIMIT : PROD_LIMIT);

export const handleRequest = (req) => {
  const { apiLimit } = req.query;
  const apiToken = req.headers['X-API-Key'] || req.headers['x-api-key'];

  return { apiLimit, apiToken };
};

const isSameDate = (first, second) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

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
  let developer = await Developer.findOne({ apiKey });
  if (developer) {
    console.timeEnd('Finding developer account');
    return developer;
  }
  // Legacy implementation: hashed API tokens can't be indexed
  // This logic attempts to find the developer document and update it
  // with the API token
  const developers = await Developer.find({});
  developer = developers.find((dev) => compareSync(apiKey, dev.apiKey));
  if (developer) {
    developer.apiKey = apiKey;
    const updatedDeveloper = await developer.save();
    console.timeEnd('Finding developer account');
    return updatedDeveloper;
  }
  console.timeEnd('Finding developer account');
  return developer;
};

export const checkDeveloperAPILimit = async (apiKey) => {
  const developer = await findDeveloper(apiKey);
  console.log(developer);

  if (developer) {
    if (developer.usage.count >= determineLimit(PROD_LIMIT)) {
      throw new Error('You have exceeded your limit of requests for the day', { cause: 403 });
    }
    await handleDeveloperUsage(developer);
    return developer;
  }

  throw new Error('Invalid API Key. Check your API Key and try again', { cause: 401 });
};
