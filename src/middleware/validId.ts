import mongoose from 'mongoose';
import { NextFunction, Request, Response } from 'express';

export default (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      return res.send({ error: 'Provided an invalid id' });
    }
    return next();
  } catch (err: any) {
    res.status(400);
    return res.send({ error: err.message });
  }
};
