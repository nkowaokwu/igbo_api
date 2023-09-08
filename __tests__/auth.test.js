import { newDeveloperData } from './__mocks__/documentData';
import { createDeveloper, loginDeveloper } from './shared/commands';

describe('login', () => {
  it('should hit the login endpoint and return a message', async () => {
    const res = await createDeveloper(newDeveloperData);
    const data = {
      email: res.body.email,
      password: res.body.password,
    };
    const login = await loginDeveloper(data);
    expect(login.status).toEqual(200);
    expect(login.body.message).toEqual('Logging in...');
  });
});
