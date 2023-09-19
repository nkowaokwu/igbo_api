import { getApp, initializeApp } from 'firebase/app';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { isProduction } from '../config';

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

const STAGING_FIREBASE_CONFIG: FirebaseConfig = {
  apiKey: 'AIzaSyDA4Osryb094cI6ER3-iv7dtKqniHZJo0o',
  authDomain: 'nkowaokwu-davydocsurg.firebaseapp.com',
  projectId: 'nkowaokwu-davydocsurg',
  storageBucket: 'nkowaokwu-davydocsurg.appspot.com',
  messagingSenderId: '466044324666',
  appId: '1:466044324666:web:078a574d09a3380fc75e03',
  measurementId: 'G-9NPCPQ8S76',
};

const PRODUCTION_FIREBASE_CONFIG: FirebaseConfig = {
  apiKey: 'AIzaSyDA4Osryb094cI6ER3-iv7dtKqniHZJo0o',
  authDomain: 'nkowaokwu-davydocsurg.firebaseapp.com',
  projectId: 'nkowaokwu-davydocsurg',
  storageBucket: 'nkowaokwu-davydocsurg.appspot.com',
  messagingSenderId: '466044324666',
  appId: '1:466044324666:web:078a574d09a3380fc75e03',
  measurementId: 'G-9NPCPQ8S76',
};

initializeApp(isProduction ? PRODUCTION_FIREBASE_CONFIG : STAGING_FIREBASE_CONFIG);

const functions = getFunctions(getApp());
if (!isProduction) {
  connectFunctionsEmulator(functions, 'localhost', 5005);
  console.debug('Using Functions emulator: http://localhost:5005');
}
