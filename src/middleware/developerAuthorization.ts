import * as admin from 'firebase-admin';
import { getDeveloperByFirebaseId } from '../controllers/developers';
import { MiddleWare } from '../types';

const developerAuthorization: MiddleWare = async (req, res, next) => {
  const { id } = req.params;
  try {
    // Decoding authorization header for Firebase
    const authorizationHeader = req.get('authorization') || '';
    if (!authorizationHeader.startsWith('Bearer ')) {
      throw new Error('Malformatted authorization header.');
    }

    const token = authorizationHeader.split(' ')[1] || '';
    const decoded = await admin.auth().verifyIdToken(token);

    req.user = decoded;

    const developer = await getDeveloperByFirebaseId(req.user.uid);
    req.developer = developer;

    if (req.user.uid !== id) {
      throw new Error('Unable to access this resource.');
    }

    return next();
  } catch (err: any) {
    return res.status(404).send({ error: err?.message || 'Unable to authorize request.' });
  }
};

export default developerAuthorization;
