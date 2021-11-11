import { hash } from 'bcrypt';
import { v4 as uuid } from 'uuid';
import Developer from '../models/Developer';
import { sendNewDeveloper } from './email';

const TEST_EMAIL = 'developer@example.com';

/* Creates a new apiKey to be associated with a developer */
const generateApiKey = uuid;

/* Creates a new Developer in the database */
export const postDeveloper = async (req, res, next) => {
  try {
    const { body: data } = req;
    const {
      email,
      password,
      name,
    } = data;

    const developers = await Developer.find({ email });
    if (developers.length && email !== TEST_EMAIL) {
      throw new Error('This email is already used');
    }

    if ((process.env.NODE_ENV === 'production' || process.env.CLIENT_TEST) && email === TEST_EMAIL) {
      throw new Error('This email is already used');
    }

    const apiKey = generateApiKey();
    const hashedApiKey = await hash(apiKey, 10);
    const hashedPassword = await hash(password, 10);
    const developer = new Developer({
      name,
      email,
      apiKey: hashedApiKey,
      password: hashedPassword,
    });
    await developer.save();
    console.log('Saved the developer!');
    if (process.env.NODE_ENV !== 'test') {
      console.log('Attempting to send email');
      await sendNewDeveloper({ to: email, apiKey, name });
    }
    console.log('Respond to client');
    return res.send({
      message: `Success email sent to ${email}`,
      ...(process.env.NODE_ENV === 'test' ? { apiKey } : {}),
    });
  } catch (err) {
    console.log('Here is an error');
    console.trace(err);
    return next(err);
  }
};
