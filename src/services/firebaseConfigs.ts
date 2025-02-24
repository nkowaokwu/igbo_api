interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

export const STAGING_FIREBASE_CONFIG: FirebaseConfig = {
  apiKey: 'AIzaSyBk96Lx1weQcOliPZfc3w2aw1Az8n16E8o',
  authDomain: 'igbo-api-staging-99a67.firebaseapp.com',
  projectId: 'igbo-api-staging-99a67',
  storageBucket: 'igbo-api-staging-99a67.appspot.com',
  messagingSenderId: '225886570045',
  appId: '1:225886570045:web:06ec83640f8868f5a04c54',
};

export const PRODUCTION_FIREBASE_CONFIG: FirebaseConfig = {
  apiKey: 'AIzaSyBDXPLmvu7YEagwdgp_W4uoZhCglbXrG6M',
  authDomain: 'igboapi-bb22d.firebaseapp.com',
  projectId: 'igboapi-bb22d',
  storageBucket: 'igboapi-bb22d.appspot.com',
  messagingSenderId: '299917108135',
  appId: '1:299917108135:web:e5053fceeba3155b624c82',
  measurementId: 'G-YGGV667F2H',
};
