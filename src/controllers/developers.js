import crypto from 'crypto';
import { flatten } from 'lodash';
import { v4 as uuid } from 'uuid';
import { DEVELOPER_SECRET } from '../config';
import Developer from '../models/Developer';
import { sendNewDeveloper } from './email';

const TEST_EMAIL = 'developer@example.com';

/* Creates a new apiKey to be associated with a developer */
const generateApiKey = uuid;

/* Hashes any value */
export const hash = (value) => {
  const algorithm = 'sha512';
  const secret = DEVELOPER_SECRET;
  return crypto.createHmac(algorithm, secret).update(value).digest('hex');
};

/* Creates a new Developer in the database */
export const postDeveloper = async (req, res, next) => {
  try {
    const { body: data } = req;
    const {
      email,
      host,
      password,
      name,
    } = data;

    const developers = await Developer.find({ email });
    if (developers.length && process.env.NODE !== 'test' && email !== TEST_EMAIL) {
      throw new Error('This email is already used');
    }

    const apiKey = generateApiKey();
    const hashedApiKey = hash(apiKey);
    const hashedPassword = hash(password);
    const hosts = flatten([host]);
    const developer = new Developer({
      name,
      email,
      hosts,
      password: hashedPassword,
      apiKey: hashedApiKey,
    });
    await developer.save();
    if (process.env.NODE_ENV !== 'test') {
      await sendNewDeveloper({ to: email, apiKey, name });
    }
    return res.send({
      message: `Succes email sent to ${email}`,
      ...(process.env.NODE_ENV === 'test' ? { apiKey } : {}),
    });
  } catch (err) {
    return next(err);
  }
};
