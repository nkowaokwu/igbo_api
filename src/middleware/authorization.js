import UserRoles from '../shared/constants/userRoles';

/* Determines API permission levels based on user role */
const authorization = (permittedRoles = []) => (req, res, next) => {
  const { user = {} } = req;

  /* As long as the user has a valid Firebase uid then they have access */
  if (!permittedRoles.length && user.uid) {
    return next();
  }

  if ((user && permittedRoles.includes(user.role)) || user.role === UserRoles.ADMIN) {
    /* If the user's role is found in the array of permitted roles,
    * the user is granted access
    */
    return next();
  }

  res.status(403);
  return res.send({ error: 'Unauthorized. Invalid user permissions.' });
};

export default authorization;
