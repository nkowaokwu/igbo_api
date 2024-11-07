import { NextFunction, Request, Response } from 'express';

export default (maxAge = 302400, smaxAge = 604800, noCache = false) =>
  (req: Request, res: Response, next: NextFunction) => {
    res.set(
      'Cache-Control',
      noCache ? 'no-store' : `public, max-age=${maxAge}, s-maxage=${smaxAge}`
    );
    return next();
  };
