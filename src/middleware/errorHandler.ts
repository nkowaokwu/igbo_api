import { Request, Response, NextFunction } from 'express';

export default (err, req: Request, res: Response, next: NextFunction) => {
  res.status(400);
  /* Depending on the nested error message the status code will change */
  if (err.message.match(/No .{1,} exist(s)?/) || err.message.match(/doesn't exist(s)?/)) {
    res.status(404);
  }
  console.log(err?.stack);
  return res.send({ error: err.message });
};
