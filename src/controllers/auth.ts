import { Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Developer as DeveloperType, Express } from '../types';
import { isProduction, isTest } from '../config';
import { createDbConnection, handleCloseConnection } from '../services/database';
import { developerSchema } from '../models/Developer';
import { TEST_EMAIL } from '../shared/constants/Developers';
import { JWT_SECRET, cookieOptions } from '../siteConstants';

/**
 * Compares a hashed password with a plaintext password to check for a match.
 *
 * @param {string} password - The plaintext password.
 * @param {string} hash - The hashed password stored in the database.
 * @returns {Promise<boolean>} A Promise that resolves to true if the passwords match, or false if they do not.
 * @throws {Error} If an error occurs during the password comparison process.
 */
const checkPassword = async (password: string, hash: string) => {
  const result = await bcrypt.compare(password, hash);
  return result;
};

/**
 * Signs a JSON Web Token (JWT) with the provided data.
 *
 * @param {string} email - The developer's email.
 * @returns {string} The signed JWT token.
 * @throws {Error} If an error occurs during the token signing process.
 */
const signToken = (email: string) => {
  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1d' });
  return token;
};

/**
 * Creates and sends a JSON Web Token (JWT) to the client in a response.
 *
 * @param {DeveloperType} developer - The developer data to include in the JWT payload.
 * @param {Express.Response} res - The Express response object to send the token in.
 * @returns {string} The signed JWT token.
 * @throws {Error} If an error occurs during the token signing or sending process.
 */
const createSendToken = (developer: DeveloperType, res: Response) => {
  const token = signToken(developer.email);
  if (isProduction) cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);

  return token;
};

/**
 * Authenticates a developer with the provided email and password.
 *
 * @param {string} email - The developer's email.
 * @param {string} password - The developer's password.
 * @returns {Promise<DeveloperType | null>} A Promise that resolves with the authenticated developer or null
 * @throws {Error} If an error occurs during the authentication process.
 */
const loginDeveloperWithEmailAndPassword = async (email: string, password: string) => {
  const connection = createDbConnection();
  const Developer = connection.model('Developer', developerSchema);
  const developer = await Developer.findOne({ email }).select('+password');
  if ((!developer && email !== TEST_EMAIL) || !(await checkPassword(password, developer!.password))) {
    throw new Error('Email or password is incorrect.');
  }
  const loggedInDev = {
    name: developer?.name,
    email: developer?.email,
    usage: developer?.usage,
  };
  await handleCloseConnection(connection);
  return loggedInDev;
};

/**
 * Handles the login process for a developer.
 *
 * @param {Express.IgboAPIRequest} req - The Express request object.
 * @param {Express.Response} res - The Express response object.
 * @param {Express.NextFunction} next - The next middleware function.
 * @returns {Promise<void>} A Promise that resolves when the login process is complete.
 * @throws {Error} If an error occurs during the login process.
 */
export const login: Express.MiddleWare = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const developer = await loginDeveloperWithEmailAndPassword(email, password);
    const token = createSendToken(developer as DeveloperType, res);

    return res.status(200).send({
      message: 'Logged in successfully',
      developer,
      token,
    });
  } catch (error) {
    if (!isTest) {
      console.trace(error);
    }
    return next(error);
  }
};

/**
 * Handles the logout process for a developer.
 * @param {Express.IgboAPIRequest} req - The Express request object.
 * @param {Express.Response} res - The Express response object.
 * @param {Express.NextFunction} next - The next middleware function.
 * @returns {Promise<void>} A Promise that resolves when the logout process is complete.
 */
export const logout: Express.MiddleWare = async (req, res, next) => {
  try {
    res.cookie('jwt', '', { expires: new Date(), httpOnly: true });

    const message = 'Logged out successfully';
    return res.status(200).send({
      message,
    });
  } catch (error) {
    if (!isTest) {
      console.trace(error);
    }
    return next(error);
  }
};
