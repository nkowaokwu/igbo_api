export const auth = jest.fn(() => ({
  verifyIdToken: jest.fn((id) => ({
    uid: id,
  })),
}));
