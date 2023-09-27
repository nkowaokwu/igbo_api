import { hash } from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { isProduction, CLIENT_TEST, isTest } from '../config';
import { developerSchema } from '../models/Developer';
import { createDbConnection, handleCloseConnection } from '../services/database';
import { Express } from '../types';
import { sendNewDeveloper } from './email';
import { findDeveloper } from './utils/findDeveloper';
import { TEST_EMAIL } from '../shared/constants/Developers';

/* Creates a new apiKey to be associated with a developer */
const generateApiKey = uuid;

/* Creates a new Developer in the database */
export const postDeveloper: Express.MiddleWare = async (req, res, next) => {
  const connection = createDbConnection();
  const Developer = connection.model('Developer', developerSchema);

  try {
    const { body: data } = req;
    const { email, password, name } = data;

    const developers = await Developer.find({ email });
    if (developers.length && email !== TEST_EMAIL) {
      throw new Error('This email is already used.');
    }

    if ((isProduction || CLIENT_TEST) && email === TEST_EMAIL) {
      throw new Error('This email is already used.');
    }

    const apiKey = generateApiKey();
    const hashedPassword = await hash(password, 10);
    const developer = new Developer({
      name,
      email,
      apiKey,
      password: hashedPassword,
    });
    await developer.save();
    if (!isTest) {
      try {
        await sendNewDeveloper({ to: email, apiKey, name });
      } catch (err: any) {
        console.log(err?.response?.body?.errors);
      }
    }
    await handleCloseConnection(connection);
    return res.send({
      message: `Success email sent to ${email}`,
      apiKey,
    });
  } catch (err: any) {
    await handleCloseConnection(connection);
    if (!isTest) {
      console.trace(err);
    }
    return next(err);
  }
};

/* Fetches a Developer in the database */
export const getDeveloper: Express.MiddleWare = async (req, res, next) => {
  try {
    const { headers: data } = req;
    const apiKey = data['x-api-key' || 'X-API-Key'];
    if (!apiKey) {
      throw new Error('No API key provided.');
    }

    const developer = await findDeveloper(apiKey as string);

    if (!developer) {
      throw new Error('No developer exists');
    }

    return res.send({
      developer,
    });
  } catch (err) {
    if (!isTest) {
      console.trace(err);
    }
    return next(err);
  }
};
