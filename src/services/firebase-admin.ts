import {
  initializeApp as initializeAdminApp,
  getApps as getAdminApps,
  getApp as getAdminApp,
} from 'firebase-admin/app';

const adminApps = getAdminApps();
let currentAdminApp;
// Initialize Admin Firebase
if (!adminApps.length) {
  currentAdminApp = initializeAdminApp();
} else {
  currentAdminApp = getAdminApp();
}

export const adminApp = currentAdminApp;
