import { assign } from 'lodash';
import Developer from '../models/Developer';
import { hash } from '../controllers/developers';
import { searchDeveloperWithHostsQuery } from '../controllers/utils/queries';
import { MAIN_KEY } from '../config';

const LIMIT = 2500;
const FALLBACK_HOST = 'http://localhost:8000';
const FALLBACK_API_KEY = 'fallback_api_key';

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
const handleDeveloperUsage = (developer) => {
  const updatedDeveloper = assign(developer);
  const isNewDay = !isSameDate(updatedDeveloper.usage.date, new Date());
  updatedDeveloper.usage.date = Date.now();

  if (isNewDay) {
    updatedDeveloper.usage.count = 0;
  } else {
    updatedDeveloper.usage.count += 1;
  }

  return updatedDeveloper.save();
};

export default async (req, res, next) => {
  try {
    let apiKey = req.headers['X-API-Key'] || req.headers['x-api-key'];
    let host = req.headers.Origin || req.headers.origin;

    if ((!apiKey || !host) && process.env.NODE_ENV !== 'production') {
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

    /* Official sites can bypass validation */
    if (apiKey === MAIN_KEY) {
      return next();
    }

    if (apiKey === FALLBACK_API_KEY && process.env.NODE_ENV !== 'production') {
      return next();
    }

    let developer;
    /* Developer is a development environment */
    if (host.match(/localhost/)) {
      const hashedApiKey = hash(apiKey);
      developer = Developer.findOne({ apiKey: hashedApiKey });
    } else {
      const hostsQuery = searchDeveloperWithHostsQuery(host);
      const developers = await Developer.find(hostsQuery);
      developer = developers.find((dev) => isHashedValueKey(apiKey, dev.apiKey));
    }

    if (developer) {
      if (developer.usage.count >= LIMIT) {
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
