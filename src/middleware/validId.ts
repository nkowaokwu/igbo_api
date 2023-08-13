import mongoose from 'mongoose';
import { Express } from '../types';

const validId: Express.MiddleWare = async (req, res, next) => {
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

export default validId;
