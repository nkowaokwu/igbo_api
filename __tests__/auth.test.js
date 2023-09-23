import { newDeveloperData } from './__mocks__/documentData';
import { createDeveloper, loginDeveloper } from './shared/commands';

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
});
