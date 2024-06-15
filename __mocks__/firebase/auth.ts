export const getAuth = jest.fn(() => ({
  currentUser: {
    uid: 'uid',
    getIdToken: () => 'uid-id-token',
  },
}));
export const connectAuthEmulator = jest.fn();
