import Developer from '../models/Developer';
import { hash } from '../controllers/developers';
import { searchDeveloperWithHostsQuery } from '../controllers/utils/queries';
import { MAIN_KEY } from '../config';

const PROD_LIMIT = 2500;
const FALLBACK_HOST = 'http://localhost:8000';
const FALLBACK_API_KEY = 'fallback_api_key';

const determineLimit = (apiLimit) => (
  process.env.NODE_ENV === 'test'
    ? apiLimit || PROD_LIMIT
    : PROD_LIMIT
);

const isSameDate = (first, second) => (
  first.getFullYear() === second.getFullYear()
    && first.getMonth() === second.getMonth()
    && first.getDate() === second.getDate()
);

/* Checks to see if provided value is the key to generate the hashedValue */
const isHashedValueKey = (value, hashedValue) => {
  const providedHashedValue = hash(value);
  return providedHashedValue === hashedValue;
};

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
const findDeveloper = async ({ host, apiKey }) => {
  /* Developer is a development environment */
  if (host.match(/localhost/)) {
    const hashedApiKey = hash(apiKey);
    return Developer.findOne({ apiKey: hashedApiKey });
  }
  const hostsQuery = searchDeveloperWithHostsQuery(host);
  const developers = await Developer.find(hostsQuery);
  return developers.find((dev) => isHashedValueKey(apiKey, dev.apiKey));
};

export default async (req, res, next) => {
  try {
    const { apiLimit } = req.query;
    let apiKey = req.headers['X-API-Key'] || req.headers['x-api-key'];
    let host = req.headers.Origin || req.headers.origin;

    /* Official sites can bypass validation */
    if (apiKey === MAIN_KEY) {
      req.isUsingMainKey = true;
      return next();
    }
    req.isUsingMainKey = false;

    if ((!apiKey || !host) && process.env.NODE_ENV === 'development') {
      if (!host) {
        host = FALLBACK_HOST;
      }
      if (!apiKey) {
        apiKey = FALLBACK_API_KEY;
      }
    }
    if (!apiKey) {
      throw new Error('X-API-Key Header doesn\'t exist');
    }
    if (!host) {
      throw new Error('Origin Header doesn\'t exist');
    }

    /* While in development or testing, using the FALLBACK_API_KEY will grant access */
    if (apiKey === FALLBACK_API_KEY && process.env.NODE_ENV !== 'production') {
      return next();
    }

    const developer = await findDeveloper({ host, apiKey });

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
  } catch (err) {
    res.status(400);
    return res.send({ error: err.message });
  }
};
