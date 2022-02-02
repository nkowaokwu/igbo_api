import axios from 'axios';
import { GA_TRACKING_ID, GA_URL } from '../config';

const trackEvent = ({
  clientIdentifier,
  category,
  action,
  label,
  value,
}) => {
  const data = {
    v: '1',
    tid: GA_TRACKING_ID,
    cid: clientIdentifier,
    t: 'event',
    ec: category,
    ea: action,
    el: label,
    ev: value,
  };

  if (process.env.NODE_ENV === 'production') {
    axios.get(GA_URL, {
      params: data,
    });
  } else {
    console.log('Logging the data:', data);
  }
};

export default async (req, res, next) => {
  try {
    const { method } = req;
    const developerAPIKey = req.headers['X-API-Key'] || req.headers['x-api-key'];
    const { keyword } = req.query;
    const { pathname } = req._parsedUrl;

    trackEvent({
      clientIdentifier: developerAPIKey || 'anon_client_id',
      category: pathname,
      action: method,
      label: 'Igbo API',
      value: keyword,
    });

    return next();
  } catch (err) {
    return next(err);
  }
};
