import * as admin from 'firebase-admin';

/* Validates the user-provided auth token */
const authentication = async (req, res, next) => {
  const authHeader = req.headers.Authorization || req.headers.authorization;

  /* Overrides user role for local development and testing purposes */
  if (!authHeader.startsWith('Bearer ') && process.env.NODE_ENV !== 'production') {
    const { role = 'admin' } = req.query;
    req.user = { role };
    return next();
  }

  if (authHeader) {
    if (!authHeader.startsWith('Bearer ')) {
      res.status(400);
      return res.send({ error: 'Malformed authorization header. Must start with \'Bearer\'' });
    }
    const token = authHeader.split(' ')[1];

    try {
      const decoded = await admin.auth().verifyIdToken(token);
      req.user = { role: decoded.role, uid: decoded.uid };
      // TODO: try optional chaining
      if (req.user && !req.user.role) {
        res.status(400);
        return res.send({ error: 'Invalid auth token' });
      }
    } catch (err) {
      res.status(403);
      return res.send({ error: err });
    }

    return next();
  }
  /* No auth token provided */
  res.status(403);
  return res.send({ error: 'Unauthorized to access this resource' });
};

export default authentication;
