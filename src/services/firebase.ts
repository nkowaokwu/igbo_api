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
  apiKey: 'AIzaSyBk96Lx1weQcOliPZfc3w2aw1Az8n16E8o',
  authDomain: 'igbo-api-staging-99a67.firebaseapp.com',
  projectId: 'igbo-api-staging-99a67',
  storageBucket: 'igbo-api-staging-99a67.appspot.com',
  messagingSenderId: '225886570045',
  appId: '1:225886570045:web:06ec83640f8868f5a04c54',
};

const PRODUCTION_FIREBASE_CONFIG: FirebaseConfig = {
  apiKey: 'AIzaSyBDXPLmvu7YEagwdgp_W4uoZhCglbXrG6M',
  authDomain: 'igbo-api-bb22d.firebaseapp.com',
  projectId: 'igbo-api-bb22d',
  storageBucket: 'igbo-api-bb22d.appspot.com',
  messagingSenderId: '299917108135',
  appId: '1:299917108135:web:e5053fceeba3155b624c82',
  measurementId: 'G-YGGV667F2H',
};

initializeApp(isProduction ? PRODUCTION_FIREBASE_CONFIG : STAGING_FIREBASE_CONFIG);

const functions = getFunctions(getApp());
if (!isProduction) {
  connectFunctionsEmulator(functions, 'localhost', 5005);
  console.debug('Using Functions emulator: http://localhost:5005');
}
