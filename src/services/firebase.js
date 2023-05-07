import { getApp, initializeApp } from 'firebase/app';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { isProduction } from '../config';

const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyDA4Osryb094cI6ER3-iv7dtKqniHZJo0o',
  authDomain: 'nkowaokwu-davydocsurg.firebaseapp.com',
  projectId: 'nkowaokwu-davydocsurg',
  storageBucket: 'nkowaokwu-davydocsurg.appspot.com',
  messagingSenderId: '466044324666',
  appId: '1:466044324666:web:078a574d09a3380fc75e03',
  measurementId: 'G-9NPCPQ8S76',
  // apiKey: 'AIzaSyBDXPLmvu7YEagwdgp_W4uoZhCglbXrG6M',
  // authDomain: 'igbo-api-bb22d.firebaseapp.com',
  // projectId: 'igbo-api-bb22d',
  // storageBucket: 'igbo-api-bb22d.appspot.com',
  // messagingSenderId: '299917108135',
  // appId: '1:299917108135:web:e5053fceeba3155b624c82',
  // measurementId: 'G-YGGV667F2H',
};

initializeApp(FIREBASE_CONFIG);

const functions = getFunctions(getApp());
if (!isProduction) {
  connectFunctionsEmulator(functions, 'localhost', 5005);
  console.debug('Using Functions emulator: http://localhost:5005');
}
