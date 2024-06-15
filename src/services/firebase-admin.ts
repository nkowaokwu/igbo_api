import {
  initializeApp as initializeAdminApp,
  getApps as getAdminApps,
  getApp as getAdminApp,
} from 'firebase-admin/app';
import { isProduction } from '../config';

const adminApps = getAdminApps();
let currentAdminApp;
// Initialize Admin Firebase
if (!adminApps.length) {
  currentAdminApp = !isProduction
    ? initializeAdminApp()
    : initializeAdminApp({ projectId: 'igbo-api-staging-99a67' });
} else {
  currentAdminApp = getAdminApp();
}

export const adminApp = currentAdminApp;
