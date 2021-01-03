/* Get all users from Firebase */
import * as admin from 'firebase-admin';

const formatUser = (user) => {
  const customClaims = (user.customClaims || { role: '' });
  const role = customClaims.role ? customClaims.role : '';
  return {
    uid: user.uid,
    id: user.uid,
    email: user.email || '',
    displayName: user.displayName || '',
    role,
    lastSignInTime: user.metadata.lastSignInTime,
    creationTime: user.metadata.creationTime,
  };
};

/* Looks into Firebase for users */
export const findUsers = async () => {
  const result = await admin.default.auth().listUsers();
  const users = result.users.map((user) => formatUser(user));
  return users;
};

/* Grab all users in the Firebase database */
export const getUsers = async (_, res, next) => {
  try {
    const users = await findUsers();
    res.setHeader('Content-Range', users.length);
    res.status(200);
    return res.send(users);
  } catch {
    return next(new Error('An error occurred while grabbing all users'));
  }
};

// TODO: Hide certain fields depending on user role
/* Looks into Firebase for user */
export const findUser = async (uid) => {
  if (process.env.NODE_ENV !== 'test') {
    const user = await admin.auth().getUser(uid);
    return formatUser(user);
  }
  return uid;
};

/* Grab a single user from the Firebase dataabase */
export const getUser = async (req, res, next) => {
  try {
    const { uid } = req.params;
    const user = await findUser(uid);
    res.status(200);
    return res.send(user);
  } catch {
    return next(new Error('An error occurred while grabbing a single user'));
  }
};

export const testGetUsers = (_, res) => {
  res.status(200);
  return res.send([{}]);
};
