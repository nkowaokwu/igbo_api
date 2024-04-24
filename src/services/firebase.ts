import { getApp, getApps, initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import firebaseSdkConfig from '../../firebase.json';
import { PRODUCTION_FIREBASE_CONFIG, STAGING_FIREBASE_CONFIG } from './firebaseConfigs';

const apps = getApps();

let currentApp;
// Initialize Firebase
if (!apps.length) {
  currentApp = initializeApp(true ? PRODUCTION_FIREBASE_CONFIG : STAGING_FIREBASE_CONFIG);
} else {
  currentApp = getApp();
}

export const app = currentApp;
export const auth = getAuth(currentApp);
const functions = getFunctions(currentApp);

const isProduction =
  typeof window !== 'undefined' ? window?.location?.host === 'igboapi.com' : false;
if (!isProduction) {
  connectFunctionsEmulator(functions, 'localhost', firebaseSdkConfig.emulators.functions.port);
  connectAuthEmulator(auth, `http://localhost:${firebaseSdkConfig.emulators.auth.port}`);
  console.info(
    `Using Functions emulator: http://localhost:${firebaseSdkConfig.emulators.functions.port}`
  );
  console.info(
    `Using Functions emulator: http://localhost:${firebaseSdkConfig.emulators.auth.port}`
  );
}
