import { developerData2 } from './__mocks__/documentData';
import { createDeveloper, loginDeveloper } from './shared/commands';

describe('login', () => {
  it('should hit the login endpoint and return a message', async () => {
    const res = await createDeveloper(developerData2);
    const data = {
      email: res.body.email,
      password: res.body.password,
    };
    const login = await loginDeveloper(data);
    expect(login.status).toEqual(200);
    expect(login.body.message).toEqual('Logging in...');
  });
});
