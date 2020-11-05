/* Validates the user-provided auth token */
const authentication = (req, res, next) => {
  const authHeader = req.headers.Authorization;

  /* Overrides user role for local development and testing purposes */
  if (process.env.NODE_ENV !== 'production') {
    const { role = 'admin' } = req.query;
    req.user = { role }; // TODO: Update the shape of this object to match Firebase's user object
    return next();
  }

  if (authHeader) {
    // eslint-disable-next-line
    const token = authHeader.split(' ')[1];

    // TODO: Verify the Firebase token is valid
    // If the token is valid place the user object on the req object
    // Example: req.user = token.user

    return next();
  }
  /* No auth token provided */
  res.status(403);
  return res.send({ error: 'Unauthorized to access this resource' });
};

export default authentication;
