import {
  initializeApp as initializeAdminApp,
  applicationDefault,
  getApps as getAdminApps,
  getApp as getAdminApp,
} from 'firebase-admin/app';
import { isProduction } from '../config';

const adminApps = getAdminApps();
let currentAdminApp;

console.log('what is the environment', isProduction, adminApps.length);
// Initialize Admin Firebase
if (!adminApps.length) {
  currentAdminApp = !isProduction
    ? initializeAdminApp({ credential: applicationDefault(), projectId: 'igbo-api-bb22d' })
    : initializeAdminApp({ projectId: 'igbo-api-staging-99a67' });
} else {
  currentAdminApp = getAdminApp();
}

export const adminApp = currentAdminApp;
