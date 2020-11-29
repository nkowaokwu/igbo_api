import UserRoles from '../shared/constants/userRoles';

/* Determines API permission levels based on user role */
const authorization = (permittedRoles) => (req, res, next) => {
  const { user = {} } = req;

  /* If the user's role is found in the array of permitted roles,
   * the user is granted access
   */
  if ((user && permittedRoles.includes(user.role)) || user.role === UserRoles.ADMIN) {
    next();
  } else {
    res.status(403);
    res.send({ error: 'Unauthorized. Invalid user permissions.' });
  }
};

export default authorization;
