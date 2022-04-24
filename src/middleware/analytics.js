import axios from 'axios';
import {
  GA_TRACKING_ID,
  GA_API_SECRET,
  GA_URL,
  DEBUG_GA_URL,
} from '../config';

const trackEvent = ({
  clientIdentifier,
  category,
  action,
  keyword,
}) => {
  const params = {
    measurement_id: GA_TRACKING_ID,
    api_secret: GA_API_SECRET,
  };

  const data = JSON.stringify({
    client_id: clientIdentifier,
    events: [{
      name: 'search',
      params: {
        category,
        action,
        search_term: keyword,
      },
    }],
  });

  if (process.env.NODE_ENV !== 'production') {
    axios({
      method: 'post',
      url: `${GA_URL}?measurement_id=${params.measurement_id}&api_secret=${params.api_secret}`,
      data,
    })
      .then((res) => {
        console.log('Logging the data:', JSON.parse(data), JSON.parse(data).events[0].params);
        console.log({ status: res.status, response: res.data });
      })
      .catch((err) => console.log(typeof err?.toJSON === 'function' ? err.toJSON() : err));
  } else {
    axios({
      method: 'post',
      url: `${DEBUG_GA_URL}?measurement_id=${params.measurement_id}&api_secret=${params.api_secret}`,
      data,
    }).then((res) => {
      console.log('Logging the data:', JSON.parse(data));
      console.log('Google Analytics Debug res: ', res.data);
    })
      .catch((err) => console.log(typeof err?.toJSON === 'function' ? err.toJSON() : err));
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
      keyword,
    });

    return next();
  } catch (err) {
    return next(err);
  }
};
