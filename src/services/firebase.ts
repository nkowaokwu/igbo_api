import { getApp, getApps, initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';
import firebaseSdkConfig from '../../firebase.json';
import { PRODUCTION_FIREBASE_CONFIG, STAGING_FIREBASE_CONFIG } from './firebaseConfigs';

const apps = getApps();
const isProduction = process.env.NODE_ENV === 'production';

let currentApp;
// Initialize Firebase
if (!apps.length) {
  currentApp = initializeApp(isProduction ? PRODUCTION_FIREBASE_CONFIG : STAGING_FIREBASE_CONFIG);
} else {
  currentApp = getApp();
}

export const app = currentApp;
export const auth = getAuth(currentApp);
export const functions = getFunctions(currentApp);

if (!isProduction) {
  connectFunctionsEmulator(functions, 'localhost', firebaseSdkConfig.emulators.functions.port);
  connectAuthEmulator(auth, `http://localhost:${firebaseSdkConfig.emulators.auth.port}`, {
    disableWarnings: true,
  });
  console.info(
    `Using Functions emulator: http://localhost:${firebaseSdkConfig.emulators.functions.port}`
  );
  console.info(`Using Auth emulator: http://localhost:${firebaseSdkConfig.emulators.auth.port}`);
}
