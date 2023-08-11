import { NextFunction, Request, Response } from 'express';
import { MAIN_KEY, isProduction } from '../config';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const apiKey = req.headers['X-API-Key'] || req.headers['x-api-key'];

    if (isProduction && apiKey !== MAIN_KEY) {
      return res.status(403).send({ error: 'You do not have permission to view this resource' });
    }

    return next();
  } catch (err) {
    res.status(400);
    return res.send({ error: err.message });
  }
};
