import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../siteConstants';
import { DeveloperDocument, Express } from '../types';
import { createDbConnection, handleCloseConnection } from '../services/database';
import { developerSchema } from '../models/Developer';

type Payload = {
  email: string;
  iat?: number;
  exp?: number;
};

export const authenticate: Express.MiddleWare = async (req, res, next) => {
  let token: string | undefined;
  // Check if token is set
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    [, token] = req.headers.authorization.split(' ');
  }

  if (!token) {
    return next(new Error('Unauthorized. Please login to continue.'));
  }

  let payload: Payload;

  // verify token
  try {
    payload = jwt.verify(token, JWT_SECRET) as Payload;
  } catch (error: unknown | any) {
    return next(new Error(error.message));
  }

  // Csheck if developer still exists in the database
  const connection = createDbConnection();
  const Developer = connection.model('Developer', developerSchema);
  const { email } = payload;
  const currentUser: DeveloperDocument | null = await Developer.findOne({ email });
  if (!currentUser) {
    return next(new Error('This User does not exist'));
  }
  await handleCloseConnection(connection);

  // grant access
  req.developer = currentUser;
  return next();
};
