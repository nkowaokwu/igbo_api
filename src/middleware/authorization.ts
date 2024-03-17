import * as admin from 'firebase-admin';
import { getDeveloperByFirebaseId } from '../controllers/developers';
import { MiddleWare } from '../types';

const authorization: MiddleWare = async (req, res, next) => {
  try {
    // Decoding authorization header for Firebase
    const authorizationHeader = req.get('authorization') || '';
    if (!authorizationHeader.startsWith('Bearer ')) {
      throw new Error('You do not have permission to view this resource.');
    }

    const token = authorizationHeader.split(' ')[1] || '';
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;

    const developer = await getDeveloperByFirebaseId(req.user.uid);
    req.developer = developer;

    return next();
  } catch (err: any) {
    return res.status(404).send({ error: err?.message || 'Unable to authorize request.' });
  }
};

export default authorization;
