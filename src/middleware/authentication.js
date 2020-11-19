import * as admin from 'firebase-admin';
import { forIn } from 'lodash';
import { AUTH_TOKEN } from '../../tests/shared/constants';

/* Validates the user-provided auth token */
const authentication = async (req, res, next) => {
  try {
    const authHeader = req.headers.Authorization || req.headers.authorization;
    /* Overrides user role for local development and testing purposes */
    if (!authHeader && process.env.NODE_ENV !== 'production') {
      const { role = 'admin', uid = AUTH_TOKEN.ADMIN_AUTH_TOKEN } = req.query;
      req.user = { role, uid };
      return next();
    }

    if (authHeader) {
      if (!authHeader.startsWith('Bearer ')) {
        throw new Error('Malformed authorization header. Must start with \'Bearer\'');
      }
      const token = authHeader.split(' ')[1];

      /* Handles injecting user roles for tests */
      if (process.env.NODE_ENV === 'test') {
        forIn(AUTH_TOKEN, (value) => {
          if (token === value) {
            req.user = { role: value.split('-')[0], uid: token };
          }
        });
        if (!req.user) {
          res.status(401);
          return res.send({ error: 'Invalid auth token' });
        }
      } else {
        const decoded = await admin.auth().verifyIdToken(token);
        req.user = { role: decoded.role, uid: decoded.uid };
      }
      // TODO: try optional chaining
      if (req.user && !req.user.role) {
        res.status(401);
        return res.send({ error: 'Invalid auth token' });
      }
      return next();
    }
  } catch (err) {
    res.status(400);
    return res.send({ error: err.message });
  }

  /* No auth token provided */
  res.status(403);
  return res.send({ error: 'Unauthorized to access this resource' });
};

export default authentication;
