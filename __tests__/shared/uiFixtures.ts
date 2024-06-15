import { DecodedIdToken } from 'firebase-admin/auth';

export const decodedIdTokenFixture = (data: object = {}): DecodedIdToken => ({
  aud: 'aud',
  auth_time: Date.now(),
  email: 'uid@gmail.com',
  email_verified: false,
  exp: Date.now() + 1000,
  firebase: {
    identities: {},
    sign_in_provider: 'google.com',
  },
  iat: Date.now(),
  iss: 'project_id',
  sub: 'sub',
  uid: 'uid',
  ...data,
});
