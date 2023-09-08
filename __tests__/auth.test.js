<<<<<<< HEAD
import { anotherDeveloperData, developerOneData, newDeveloperData } from './__mocks__/documentData';
import { createDeveloper, loginDeveloper, logoutDeveloper } from './shared/commands';

describe('login', () => {
  it('should successfully log a developer in', async () => {
    const developer = await createDeveloper(newDeveloperData);
    expect(developer.status).toEqual(200);

    const data = {
      email: newDeveloperData.email,
      password: newDeveloperData.password,
    };

    const loginRes = await loginDeveloper(data);
    expect(loginRes.status).toEqual(200);
    expect(loginRes.body.developer).toMatchObject(loginRes.body.developer);
  });

  it('should not log a developer in with an incorrect password', async () => {
    const developer = await createDeveloper(developerOneData);
    expect(developer.status).toEqual(200);

    const data = {
      email: developerOneData.email,
      password: 'incorrect',
    };

    const loginRes = await loginDeveloper(data);
    expect(loginRes.status).toEqual(400);
    expect(loginRes.body.error).toEqual(loginRes.body.error);
  });

  it('should not log a developer in with an non-existent email', async () => {
    const data = {
      email: anotherDeveloperData.email,
      password: anotherDeveloperData.password,
    };

    const loginRes = await loginDeveloper(data);
    expect(loginRes.status).toEqual(400);
    expect(loginRes.body.error).toEqual(loginRes.body.error);
  });
});

describe('logout', () => {
  it('should successfully log a developer out', async () => {
    const developer = await createDeveloper(anotherDeveloperData);
    expect(developer.status).toEqual(200);

    const data = {
      email: anotherDeveloperData.email,
      password: anotherDeveloperData.password,
    };

    const loginRes = await loginDeveloper(data);
    expect(loginRes.status).toEqual(200);

    const logoutRes = await logoutDeveloper({ token: loginRes.body.token });
    expect(logoutRes.status).toEqual(200);
    expect(logoutRes.body).toMatchObject({
      message: 'Logged out successfully',
    });
=======
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
>>>>>>> 03f15e6 (Fix create login endpoint (#748))
  });
});
