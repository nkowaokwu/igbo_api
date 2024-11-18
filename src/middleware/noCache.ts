import { NextFunction, Request, Response } from 'express';

export default () => (req: Request, res: Response, next: NextFunction) => {
  res.set('Cache-Control', 'no-store');
  return next();
};
