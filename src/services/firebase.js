import { getApp, initializeApp } from 'firebase/app';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { isProduction } from '../config';

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCulhIE2ni1SxQ_lPL3lA4NpLToiBtkCjg",
  authDomain: "igbo-api-doc-site.firebaseapp.com",
  projectId: "igbo-api-doc-site",
  storageBucket: "igbo-api-doc-site.appspot.com",
  messagingSenderId: "316509373277",
  appId: "1:316509373277:web:078bcbcf7018ee69149eb4",
  measurementId: "G-X4VW49D8RW"
};

initializeApp(FIREBASE_CONFIG);

const functions = getFunctions(getApp());
if (!isProduction) {
  connectFunctionsEmulator(functions, 'localhost', 5005);
  console.debug('Using Functions emulator: http://localhost:5005');
}
