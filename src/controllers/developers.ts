import { hash } from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { Types } from 'mongoose';
import { isProduction, CLIENT_TEST, isTest } from '../config';
import { developerSchema } from '../models/Developer';
import { createDbConnection, handleCloseConnection } from '../services/database';
import { Developer as DeveloperType, MiddleWare } from '../types';
import { sendNewDeveloper } from './email';

const TEST_EMAIL = 'developer@example.com';

/* Creates a new apiKey to be associated with a developer */
const generateApiKey = uuid;

/* Creates a new Developer in the database */
export const postDeveloper: MiddleWare = async (req, res, next) => {
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

/** Updates an existing Developer in the database */
export const putDeveloper: MiddleWare = async (req, res, next) => {
  const connection = createDbConnection();
  const Developer = connection.model<DeveloperType>('Developer', developerSchema);
  const { firebaseId, email } = req.body;

  try {
    const developer = await Developer.findOne({ $or: [{ firebaseId }, { email }] });
    if (!developer) {
      throw new Error('No associated developer found.');
    }
    developer.firebaseId = firebaseId;
    await developer.save();
    return res.send({ message: 'Saved Developer account' });
  } catch (err) {
    return next(err);
  }
};

/** Gets a Developer by the MongoDB Id, Firebase Id, Email */
export const getDeveloper: MiddleWare = async (req, res, next) => {
  const connection = createDbConnection();
  const Developer = connection.model<DeveloperType>('Developer', developerSchema);
  const { firebaseId, email } = req.body;
  const { id } = req.params;

  try {
    const developer = await Developer.findOne({
      $or: [{ firebaseId }, { email }, { _id: new Types.ObjectId(id) }],
    });
    if (!developer) {
      throw new Error('No associated developer found.');
    }
    return res.send(developer);
  } catch (err) {
    return next(err);
  }
};

/** Gets a Developer by Firebase Id */
export const getDeveloperByFirebaseId = async (firebaseId: string) => {
  const connection = createDbConnection();
  const Developer = connection.model<DeveloperType>('Developer', developerSchema);
  try {
    const developer = await Developer.findOne({ firebaseId });
    if (!developer) {
      throw new Error();
    }
    return developer.toJSON();
  } catch (err: any) {
    throw new Error(err?.message || 'Unable to find developer with Firebase Id');
  }
};
