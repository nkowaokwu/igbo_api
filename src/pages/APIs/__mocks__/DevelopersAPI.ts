export const getDeveloper = jest.fn(async () => ({
  name: 'developer',
  apiKey: 'apiKey',
  email: 'email',
  password: 'password',
  stripeId: 'stripeId',
  firebaseId: 'firebaseId',
  usage: { date: new Date(), count: 0 },
}));
