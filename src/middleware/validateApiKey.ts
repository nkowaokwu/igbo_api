import { compareSync } from 'bcrypt';
import { developerSchema } from '../models/Developer';
import { MAIN_KEY, isTest, isDevelopment, isProduction } from '../config';
import { createDbConnection } from '../services/database';
import { DeveloperDocument, MiddleWare } from '../types';

const PROD_LIMIT = 2500;
const FALLBACK_API_KEY = 'fallback_api_key';

const determineLimit = (apiLimit = '') => (isTest ? parseInt(apiLimit, 10) || PROD_LIMIT : PROD_LIMIT);

const isSameDate = (first: Date, second: Date) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

/* Increments usage count and updates usage date */
const handleDeveloperUsage = async (developer: DeveloperDocument) => {
  const updatedDeveloper = developer;
  const isNewDay = !isSameDate(updatedDeveloper.usage.date, new Date());
  updatedDeveloper.usage.date = new Date();

  if (isNewDay) {
    updatedDeveloper.usage.count = 0;
  } else {
    updatedDeveloper.usage.count += 1;
  }

  return updatedDeveloper.save();
};

/* Finds a developer with provided information */
const findDeveloper = async (apiKey: string) => {
  const connection = createDbConnection();
  const Developer = connection.model<DeveloperDocument>('Developer', developerSchema);
  let developer = await Developer.findOne({ apiKey });
  if (developer) {
    return developer;
  }
  // Legacy implementation: hashed API tokens can't be indexed
  // This logic attempts to find the developer document and update it
  // with the API token
  const developers = await Developer.find({});
  developer = developers.find((dev) => compareSync(apiKey, dev.apiKey)) || null;
  if (developer) {
    developer.apiKey = apiKey;
    const updatedDeveloper = await developer.save();
    return updatedDeveloper;
  }
  return developer;
};

const validateApiKey: MiddleWare = async (req, res, next) => {
  try {
    const { apiLimit } = req.query;
    let apiKey = (req.headers['X-API-Key'] || req.headers['x-api-key']) as string;

    /* Official sites can bypass validation */
    if (apiKey === MAIN_KEY) {
      req.isUsingMainKey = true;
      return next();
    }
    req.isUsingMainKey = false;

    if (!apiKey && isDevelopment) {
      apiKey = FALLBACK_API_KEY;
    }
    if (!apiKey) {
      throw new Error("X-API-Key Header doesn't exist");
    }

    /* While in development or testing, using the FALLBACK_API_KEY will grant access */
    if (apiKey === FALLBACK_API_KEY && !isProduction) {
      return next();
    }

    const developer = await findDeveloper(apiKey);

    if (developer) {
      if (developer.usage.count >= determineLimit(apiLimit)) {
        res.status(403);
        return res.send({ error: 'You have exceeded your limit of requests for the day' });
      }
      await handleDeveloperUsage(developer);
      return next();
    }

    res.status(401);
    return res.send({ error: 'Your API key is invalid' });
  } catch (err: any) {
    res.status(400);
    return res.send({ error: err.message });
  }
};

export default validateApiKey;
