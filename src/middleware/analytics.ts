import axios from 'axios';
import { Request } from 'express';
import { MiddleWare } from '../types';
import {
  GA_TRACKING_ID,
  GA_API_SECRET,
  GA_URL,
  isProduction as isProductionConfig,
} from '../config';

interface TrackingEvent {
  clientIdentifier: string | string[] | undefined;
  category: string;
  action: string;
  keyword: string | string[] | undefined | Request['query'] | Request['query'][];
}

const trackEvent = ({ clientIdentifier, category, action, keyword }: TrackingEvent) =>
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
      axios({
        method: 'post',
        url: `${GA_URL}?measurement_id=${params.measurement_id}&api_secret=${params.api_secret}`,
        data,
      })
        .then(() => {
          resolve(true);
        })
        .catch((err: any) => {
          console.log(typeof err?.toJSON === 'function' ? err.toJSON() : err);
          reject(new Error(err));
        });
    } else {
      resolve(true);
    }
  });

const analytics: MiddleWare = async (req, _, next) => {
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
  } catch (err: any) {
    return next(err);
  }
};

export default analytics;
