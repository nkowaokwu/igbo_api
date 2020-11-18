/* Get all users from Firebase */
import * as admin from 'firebase-admin';

export const getUsers = async (req, res) => {
  // Use Firebase functions to get all user objects
  // This will allow for selecting individual users and updating their user roles
  const result = await admin.default.auth().listUsers();
  const users = result.users.map((userRecord) => userRecord.toJSON());
  res.status(200);
  res.send(users);
};
