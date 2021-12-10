import { MAIN_KEY } from '../config';

export default async (req, res, next) => {
  try {
    const apiKey = req.headers['X-API-Key'] || req.headers['x-api-key'];

    if (process.env.NODE_ENV === 'production' && apiKey !== MAIN_KEY) {
      return res
        .status(403)
        .send({ error: 'You do not have permission to view this resource' });
    }

    return next();
  } catch (err) {
    res.status(400);
    return res.send({ error: err.message });
  }
};
