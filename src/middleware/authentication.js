import * as admin from 'firebase-admin';

/* Validates the user-provided auth token */
const authentication = async (req, res, next) => {
  const authHeader = req.headers.Authorization;

  /* Overrides user role for local development and testing purposes */
  if (process.env.NODE_ENV !== 'production') {
    const { role = 'admin' } = req.query;
    req.user = { role };
    return next();
  }

  if (authHeader) {
    // eslint-disable-next-line
    const token = authHeader.split(' ')[1];

    try {
      const decoded = await admin.auth().verifyIdToken(token);

      // If the token is valid place the user object on the req object
      req.user = decoded.user;
      const userRecord = await admin.auth().getUser(decoded.uid);
      const userRole = userRecord.customClaims?.role;
      req.user.role = userRole;
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
