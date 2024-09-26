import { NextFunction, Request, Response } from 'express';
import { ErrorMiddleWare } from '../types';

// eslint-disable-next-line no-unused-vars
const errorHandler: ErrorMiddleWare = (err: any,  _, res, __) => {
  res.status(400);
  /* Depending on the nested error message the status code will change */
  if (err.message.match(/No .{1,} exist(s)?/) || err.message.match(/doesn't exist(s)?/)) {
    res.status(404);
  }
  console.error(err?.stack);
  return res.send({ error: err.message });
};

export default errorHandler