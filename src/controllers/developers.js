import crypto from 'crypto';
import { v4 as uuid } from 'uuid';
import { DEVELOPER_SECRET } from '../config';
import Developer from '../models/Developer';

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
    const { email, hosts, password } = data;

    const developers = await Developer.find({ email });
    if (developers.length) {
      throw new Error('This email is already used');
    }

    const apiKey = generateApiKey();
    const hashedApiKey = hash(apiKey);
    const hashedPassword = hash(password);
    const developer = new Developer({
      email,
      hosts,
      password: hashedPassword,
      apiKey: hashedApiKey,
    });
    await developer.save();
    return res.send({ email, hosts, apiKey });
  } catch (err) {
    return next(err);
  }
};
