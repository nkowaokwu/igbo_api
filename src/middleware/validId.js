import mongoose from 'mongoose';

export default (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    return res.send({ error: 'Provided an invalid id' });
  }
  return next();
};
