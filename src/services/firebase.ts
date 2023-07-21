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
  apiKey: 'AIzaSyBOleEKb60Zc0BPypCT9zgKbv1wisNvqqM',
  authDomain: 'igbo-api-13488.firebaseapp.com',
  projectId: 'igbo-api-13488',
  storageBucket: 'igbo-api-13488.appspot.com',
  messagingSenderId: '872933861176',
  appId: '1:872933861176:web:6829b33e3d297ff3fd83cd',
  measurementId: 'G-BEXP1WREEV',
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
