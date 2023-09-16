import { Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Developer as DeveloperType, Express } from '../../types';
import { isProduction, isTest } from '../../config';
import { createDbConnection } from '../../services/database';
import { developerSchema } from '../../models/Developer';
import { TEST_EMAIL } from '../../shared/constants/Developers';
import { JWT_SECRET, cookieOptions } from '../../siteConstants';

const checkPassword = async (password: string, hash: string) => {
  const result = await bcrypt.compare(password, hash);
  return result;
};

const signToken = (email: string) => {
  const jwtKey = JWT_SECRET;
  const token = jwt.sign({ email }, jwtKey, { expiresIn: '1d' });
  return token;
};

const createSendToken = (developer: DeveloperT, res: Response) => {
  const token = signToken(developer.email);
  if (isProduction) cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);

  // req.token = token;

  return token;
};

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
  return loggedInDev;
};

export const login: Express.MiddleWare = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const developer = await loginDeveloperWithEmailAndPassword(email, password);
    const token = createSendToken(developer as DeveloperT, res);

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
