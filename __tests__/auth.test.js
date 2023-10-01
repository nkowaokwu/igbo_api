import { newDeveloperData } from './__mocks__/documentData';
import { createDeveloper, loginDeveloper, logoutDeveloper } from './shared/commands';

describe('login', () => {
  it('should successfully log a developer in', async () => {
    await createDeveloper(newDeveloperData);
    const data = {
      email: newDeveloperData.email,
      password: newDeveloperData.password,
    };

    const loginRes = await loginDeveloper(data);

    expect(loginRes.status).toEqual(200);
    expect(loginRes.body.developer).toMatchObject(loginRes.body.developer);
  });

  it('should not log a developer in with incorrect credentials', async () => {
    const data = {
      email: newDeveloperData.email,
      password: 'incorrect',
    };

    const loginRes = await loginDeveloper(data);

    expect(loginRes.status).toEqual(400);
    expect(loginRes.body.error).toEqual(loginRes.body.error);
  });
});

describe('logout', () => {
  it('should successfully log a developer out', async () => {
    await createDeveloper(newDeveloperData);
    const data = {
      email: newDeveloperData.email,
      password: newDeveloperData.password,
    };

    const loginRes = await loginDeveloper(data);

    const logoutRes = await logoutDeveloper({ token: loginRes.body.token });

    expect(logoutRes.status).toEqual(200);
    expect(logoutRes.body).toMatchObject({
      message: 'Logged out successfully',
    });
  });
});
