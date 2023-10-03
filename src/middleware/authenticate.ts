import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../siteConstants';
import { Express } from '../types';
import { createDbConnection, handleCloseConnection } from '../services/database';
import { developerSchema } from '../models/Developer';

interface DeveloperDataType {
  email: string;
  iat?: number;
  exp?: number;
}

export const authenticate: Express.MiddleWare = async (req, res, next) => {
  let token: string | undefined;
  // Check if token is set
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    [, token] = req.headers.authorization.split(' ');
  }

  if (!token) {
    return next(new Error('Unauthorized. Please login to continue.'));
  }

  let developer: DeveloperDataType;

  // Verify token
  try {
    developer = jwt.verify(token, JWT_SECRET) as DeveloperDataType;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return next(new Error(error.message));
    }
    return next(new Error('Invalid token'));
  }

  // Check if developer still exists in the database
  const connection = createDbConnection();
  const Developer = connection.model('Developer', developerSchema);
  const { email } = developer;
  const currentUser = await Developer.findOne({ email });
  await handleCloseConnection(connection);
  if (!currentUser) {
    return next(new Error('This User does not exist'));
  }

  // Grant access
  req.developer = currentUser;
  return next();
};
