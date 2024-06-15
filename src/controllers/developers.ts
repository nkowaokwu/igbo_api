import { hash } from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { Document, FilterQuery, Types } from 'mongoose';
import { isProduction, CLIENT_TEST, isTest } from '../config';
import { developerSchema } from '../models/Developer';
import { createDbConnection } from '../services/database';
import { Developer as DeveloperType, MiddleWare } from '../types';
import { sendNewDeveloper } from './email';

const TEST_EMAIL = 'developer@example.com';
// If a Developer account is created by a user creating an
// account via Firebase, this will be the default password
const DEFAULT_PASSWORD = 'UNDEFINED_PASSWORD';

/* Creates a new apiKey to be associated with a developer */
const generateApiKey = uuid;
type DeveloperDocument = Document<unknown, any, DeveloperType> &
  Omit<DeveloperType & { _id: Types.ObjectId }, never>;

export const postDeveloperHelper = async ({
  data,
}: {
  data: { email: string, password: string, name: string },
}): Promise<DeveloperDocument> => {
  const connection = createDbConnection();
  const Developer = connection.model<DeveloperType>('Developer', developerSchema);

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

  const savedDeveloper = developer.save();

  return savedDeveloper;
};

export const putDeveloperHelper = async ({
  query,
  data,
}: {
  query: FilterQuery<DeveloperType>,
  data: Partial<DeveloperType>,
}) => {
  const connection = createDbConnection();
  const Developer = connection.model<DeveloperType>('Developer', developerSchema);

  let developer = await Developer.findOne(query);
  if (!developer && data.email && data.name) {
    const defaultData = { email: data.email, password: DEFAULT_PASSWORD, name: data.name };
    developer = await postDeveloperHelper({ data: defaultData });
  }

  if (!developer) {
    throw new Error('No developer to update');
  }

  Object.entries(data).forEach(([key, value]) => {
    // @ts-expect-error developer can be null
    developer[key] = value;
  });

  const savedDeveloper = await developer.save();
  return { message: 'Saved Developer account', developer: savedDeveloper.toJSON() };
};

/* Creates a new Developer in the database */
export const postDeveloper: MiddleWare = async (req, res, next) => {
  try {
    const {
      body: { email, password, name },
    } = req;
    const data = { email, password, name };
    const developer = await postDeveloperHelper({ data });

    if (!isTest) {
      try {
        await sendNewDeveloper({ to: email, apiKey: developer.apiKey, name });
      } catch (err: any) {
        console.error(err?.response?.body?.errors);
      }
    }

    return res.send({
      message: `Success email sent to ${email}`,
      apiKey: developer.apiKey,
      id: developer.id,
    });
  } catch (err) {
    if (!isTest) {
      console.error(err);
    }
    return next(err);
  }
};

/** Updates an existing Developer in the database */
export const putDeveloper: MiddleWare = async (req, res, next) => {
  const { id } = req.params;

  try {
    return res.send(await putDeveloperHelper({ query: { _id: id }, data: req.body }));
  } catch (err) {
    return next(err);
  }
};

/** Gets a Developer by the Firebase Id */
export const getDeveloper: MiddleWare = async (req, res, next) => {
  const connection = createDbConnection();
  const Developer = connection.model<DeveloperType>('Developer', developerSchema);
  const { id: firebaseId } = req.params;

  try {
    const developer = await Developer.findOne({ firebaseId });
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
