import * as admin from 'firebase-admin';
import { getDeveloperByEmail } from '../controllers/developers';
import { MiddleWare } from '../types';

const developerAuthorization: MiddleWare = async (req, res, next) => {
  const { id } = req.params;
  try {
    // Decoding authorization header for Firebase
    const authorizationHeader = req.get('authorization') || '';
    if (!authorizationHeader.startsWith('Bearer ')) {
      return res.status(403).send({ error: 'Incorrectly formatted authorization header.' });
    }

    const token = authorizationHeader.split(' ')[1] || '';
    const decoded = await admin.auth().verifyIdToken(token);

    req.user = decoded;

    if (!req.user.email) {
      return res.status(404).send({ error: 'No user email associated with Firebase' });
    }

    // Getting developer by email associated with Firebase account
    const developer = await getDeveloperByEmail(req.user.email);
    req.developer = developer;

    if (req.user.uid !== id) {
      return res.status(404).send({ error: 'Unable to access this resource ' });
    }

    return next();
  } catch (err: any) {
    return res.status(403).send({ error: err?.message || 'Unable to authorize request.' });
  }
};

export default developerAuthorization;
