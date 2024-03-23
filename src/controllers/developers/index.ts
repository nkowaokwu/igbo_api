import { hash } from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { Document, Model, Types } from 'mongoose';
import { isProduction, CLIENT_TEST, isTest } from '../../config';
import { developerSchema } from '../../models/Developer';
import { createDbConnection, handleCloseConnection } from '../../services/database';
import { Developer as DeveloperType, MiddleWare } from '../../types';
import { sendNewDeveloper } from '../email';

const TEST_EMAIL = 'developer@example.com';
// If a Developer account is created by a user creating an
// account via Firebase, this will be the default password
const DEFAULT_PASSWORD = 'UNDEFINED_PASSWORD';

/* Creates a new apiKey to be associated with a developer */
const generateApiKey = uuid;
type DeveloperDocument = Document<unknown, any, DeveloperType> &
  Omit<DeveloperType & { _id: Types.ObjectId }, never>;

export const postDeveloperHelper = async ({
  Developer,
  userData,
}: {
  Developer: Model<DeveloperType>,
  userData: { email: string, password: string, name: string },
}): Promise<DeveloperDocument> => {
  const { email, password, name } = userData;
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
  return developer.save();
};

/* Creates a new Developer in the database */
export const postDeveloper: MiddleWare = async (req, res, next) => {
  const connection = createDbConnection();
  const Developer = connection.model<DeveloperType>('Developer', developerSchema);
  try {
    const { body: data } = req;
    const { email, password, name } = data;
    const userData = { email, password, name };
    const developer = await postDeveloperHelper({ Developer, userData });

    if (!isTest) {
      try {
        await sendNewDeveloper({ to: email, apiKey: developer.apiKey, name });
      } catch (err: any) {
        console.error(err?.response?.body?.errors);
      }
    }
    await handleCloseConnection(connection);
    return res.send({
      message: `Success email sent to ${email}`,
      apiKey: developer.apiKey,
    });
  } catch (err) {
    await handleCloseConnection(connection);
    if (!isTest) {
      console.error(err);
    }
    return next(err);
  }
};

/** Updates an existing Developer in the database */
export const putDeveloper: MiddleWare = async (req, res, next) => {
  const connection = createDbConnection();
  const Developer = connection.model<DeveloperType>('Developer', developerSchema);
  const { firebaseId, email, displayName } = req.body;

  try {
    let developer = await Developer.findOne({ $or: [{ firebaseId }, { email }] });
    if (!developer) {
      const userData = { email, password: DEFAULT_PASSWORD, name: displayName };
      developer = await postDeveloperHelper({ Developer, userData });
    }
    developer.firebaseId = firebaseId;
    const savedDeveloper = await developer.save();
    return res.send({ message: 'Saved Developer account', developer: savedDeveloper });
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
      throw new Error('No developer exists');
    }
    return developer.toJSON();
  } catch (err: any) {
    throw new Error(err?.message || 'Unable to find developer with Firebase Id');
  }
};
