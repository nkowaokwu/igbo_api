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

/* Grab all users in the Firebase database */
export const getUsers = async (_, res) => {
  try {
    const result = await admin.default.auth().listUsers();
    const users = result.users.map((user) => formatUser(user));
    res.setHeader('Content-Range', users.length);
    res.status(200);
    res.send(users);
  } catch {
    res.status(400);
    res.send({ error: 'An error occurred while grabbing all users' });
  }
};

// TODO: Hide certain fields depending on user role
/* Looks into Firebase for user */
export const findUser = async (uid) => {
  const user = await admin.auth().getUser(uid);
  return formatUser(user);
};

/* Grab a single user from the Firebase dataabase */
export const getUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await findUser(uid);
    res.status(200);
    res.send(user);
  } catch {
    res.status(400);
    res.send({ error: 'An error occurred while grabbing a single user' });
  }
};

export const testGetUsers = (_, res) => {
  res.status(200);
  return res.send([{}]);
};
