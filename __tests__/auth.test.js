import { loginDeveloper } from './shared/commands';

describe('login', () => {
  it('should hit the login endpoint and return a message', async () => {
    const data = {
      email: 'test@email.com',
      password: 'password',
    };
    const login = await loginDeveloper(data);
    expect(login.status).toEqual(200);
    expect(login.body.message).toEqual('Logging in...');
  });
});
