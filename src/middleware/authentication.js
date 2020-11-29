import * as admin from 'firebase-admin';
import { forIn } from 'lodash';
import AUTH_TOKEN from '../shared/constants/testAuthTokens';
import UserRoles from '../shared/constants/userRoles';

/* Validates the user-provided auth token */
const authentication = async (req, res, next) => {
  try {
    const authHeader = req.headers.Authorization || req.headers.authorization;
    /* Overrides user role for local development and testing purposes */
    if (!authHeader && process.env.NODE_ENV !== 'production') {
      const { role = UserRoles.ADMIN, uid = AUTH_TOKEN.ADMIN_AUTH_TOKEN } = req.query;
      req.user = { role, uid };
      return next();
    }

    if (authHeader) {
      if (!authHeader.startsWith('Bearer ')) {
        throw new Error('Malformed authorization header. Must start with \'Bearer\'');
      }
      const token = authHeader.split(' ')[1] || '';

      /* Handles injecting user roles for tests */
      if (process.env.NODE_ENV === 'test') {
        forIn(AUTH_TOKEN, (value) => {
          if (token === value) {
            req.user = { role: value.split('-')[0], uid: token };
          }
        });
      }

      try {
        const decoded = await admin.auth().verifyIdToken(token);
        if (decoded && !req.user) {
          req.user = { role: decoded.role, uid: decoded.uid };
        }
      } catch {
        console.warn('Error while authing Firebase token');
      }
      return next();
    }
  } catch (err) {
    res.status(400);
    return res.send({ error: err.message });
  }
  return next();
};

export default authentication;
