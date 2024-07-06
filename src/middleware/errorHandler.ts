import { NextFunction, Request, Response } from 'express';

// eslint-disable-next-line no-unused-vars
export default (err: any, _: Request, res: Response, __: NextFunction) => {
  res.status(400);
  /* Depending on the nested error message the status code will change */
  if (err.message.match(/No .{1,} exist(s)?/) || err.message.match(/doesn't exist(s)?/)) {
    res.status(404);
  }
  console.error(err?.stack);
  return res.send({ error: err.message });
};
