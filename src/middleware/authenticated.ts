import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../siteConstants';
import { DeveloperDocument, Express } from '../types';
import { createDbConnection, handleCloseConnection } from '../services/database';
import { developerSchema } from '../models/Developer';

export const isAuthenticated: Express.MiddleWare = async (req, res, next) => {
  let token: string | undefined;
  // Check if token is set
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    [, token] = req.headers.authorization.split(' ');
  }

  if (!token) {
    return next(new Error('Unauthorized. Please login to continue.'));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let payload: any;

  // verify token
  try {
    payload = jwt.verify(token, JWT_SECRET);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return next(new Error(error.message));
  }

  // check if developer still exists in the database
  const connection = createDbConnection();
  const Developer = connection.model('Developer', developerSchema);
  const { email } = payload;
  const currentUser = await Developer.find({ email });

  if (!currentUser) {
    return next(new Error('This User does not exist'));
  }
  await handleCloseConnection(connection);

  // grant access
  req.developer = currentUser[0] as DeveloperDocument;
  return next();
};
