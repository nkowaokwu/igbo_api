import { NextFunction, Request, Response } from 'express';

export default (maxAge = 302400, smaxAge = 604800) =>
  (req: Request, res: Response, next: NextFunction) => {
    res.set('Cache-Control', `public, max-age=${maxAge}, s-maxage=${smaxAge}`);
    return next();
  };
