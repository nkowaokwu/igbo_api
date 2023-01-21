import { getApp, initializeApp } from 'firebase/app';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyBDXPLmvu7YEagwdgp_W4uoZhCglbXrG6M',
  authDomain: 'igbo-api-bb22d.firebaseapp.com',
  projectId: 'igbo-api-bb22d',
  storageBucket: 'igbo-api-bb22d.appspot.com',
  messagingSenderId: '299917108135',
  appId: '1:299917108135:web:e5053fceeba3155b624c82',
  measurementId: 'G-YGGV667F2H',
};

initializeApp(FIREBASE_CONFIG);

const functions = getFunctions(getApp());
connectFunctionsEmulator(functions, 'localhost', 5005);
console.debug('Using Functions emulator: http://localhost:5005');
