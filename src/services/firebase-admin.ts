import {
  initializeApp as initializeAdminApp,
  getApps as getAdminApps,
  getApp as getAdminApp,
} from 'firebase-admin/app';
import admin from 'firebase-admin';
import { STAGING_FIREBASE_CONFIG, PRODUCTION_FIREBASE_CONFIG } from './firebaseConfigs';
import { FIREBASE_SERVICE_ACCOUNT, isProduction } from '../config';
import firebaseSdkConfig from '../../firebase.json';

const firebaseConfig = isProduction ? PRODUCTION_FIREBASE_CONFIG : STAGING_FIREBASE_CONFIG;
const databaseURL = `http://localhost:${firebaseSdkConfig.emulators.firestore.port}/?ns=${firebaseConfig.projectId}`;
const adminApps = getAdminApps();
let currentAdminApp;
// Initialize Admin Firebase
if (!adminApps.length) {
  currentAdminApp = initializeAdminApp({
    credential: admin.credential.cert(JSON.parse(FIREBASE_SERVICE_ACCOUNT)),
    databaseURL,
  });
} else {
  currentAdminApp = getAdminApp();
}

export const adminApp = currentAdminApp;
