import axios from 'axios';
import { NextFunction, Request } from 'express';
import { GA_TRACKING_ID, GA_API_SECRET, GA_URL, DEBUG_GA_URL, isProduction as isProductionConfig } from '../config';

interface Props {
  clientIdentifier: string | string[] | undefined;
  category: string;
  action: string;
  keyword: any;
}

const trackEvent = ({ clientIdentifier, category, action, keyword }: Props) =>
  new Promise((resolve, reject) => {
    const params = {
      measurement_id: GA_TRACKING_ID,
      api_secret: GA_API_SECRET,
    };

    const isProduction = isProductionConfig && params.measurement_id && params.api_secret;

    const data = JSON.stringify({
      client_id: clientIdentifier,
      events: [
        {
          name: 'search',
          params: {
            category,
            action,
            search_term: keyword,
          },
        },
      ],
    });

    // Avoid sending GA events
    if (isProduction) {
      console.time('Sending production tracking data');
      axios({
        method: 'post',
        url: `${GA_URL}?measurement_id=${params.measurement_id}&api_secret=${params.api_secret}`,
        data,
      })
        .then((res) => {
          console.log('Logging the data:', JSON.parse(data), JSON.parse(data).events[0].params);
          console.log({ status: res.status, response: res.data });
          console.timeEnd('Sending production tracking data');
          resolve(true);
        })
        .catch((err) => {
          console.log(typeof err?.toJSON === 'function' ? err.toJSON() : err);
          console.timeEnd('Sending production tracking data');
          reject(new Error(err));
        });
    } else {
      console.time('Sending development tracking data');
      axios({
        method: 'post',
        url: `${DEBUG_GA_URL}?measurement_id=${params.measurement_id}&api_secret=${params.api_secret}`,
        data,
      })
        .then(() => {
          console.timeEnd('Sending development tracking data');
          resolve(true);
        })
        .catch((err) => {
          if (isProduction) {
            console.log(typeof err?.toJSON === 'function' ? err.toJSON() : err);
            console.timeEnd('Sending development tracking data');
            reject(new Error(err));
          }
        });
    }
  });

export default async (req: Request, next: NextFunction) => {
  try {
    const { method } = req;
    const developerAPIKey = req.headers['X-API-Key'] || req.headers['x-api-key'];
    const { keyword } = req.query;
    const { pathname } = req.params;

    await trackEvent({
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
