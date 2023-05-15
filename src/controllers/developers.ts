import { hash } from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { isProduction, CLIENT_TEST, isTest } from '../config';
import { developerSchema } from '../models/Developer';
import { createDbConnection, handleCloseConnection } from '../services/database';
import { Express } from '../types';
import { sendNewDeveloper } from './email';

const TEST_EMAIL = 'developer@example.com';

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

export const getDeveloper = async (req, res, next) => {
  const connection = createDbConnection();
  const Developer = connection.model('Developer', developerSchema);
  const devId = req.params.id;
  try {
    const developer = await Developer.find({ _id: devId });
    await handleCloseConnection(connection);
    return res.send({
      message: 'Success',
      developer,
    });
  } catch (err) {
    await handleCloseConnection(connection);
    if (!isTest) {
      console.trace(err);
    }
    return next(err);
  }
};
