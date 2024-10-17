import {
  requestFixture,
  responseFixture,
  nextFunctionFixture,
} from '../../__tests__/shared/fixtures';
import {
  getDeveloper,
  getDeveloperByEmail,
  postDeveloper,
  postDeveloperHelper,
  putDeveloper,
} from '../developers';
import Plan from '../../shared/constants/Plan';

class Developer {
  local = {};
  constructor(value: object) {
    this.local = { ...value, plan: Plan.STARTER, toJSON: () => value };
  }

  static find() {
    return [];
  }

  static findOne() {}

  save() {
    return { ...this.local, toJSON: () => this.local };
  }
}

describe('developers', () => {
  it('helps post a new developer', async () => {
    const data = { email: 'email', password: 'password', name: 'name' };
    const res = await postDeveloperHelper({
      // @ts-expect-error Developer
      Developer,
      data,
    });

    expect(res.name).toEqual('name');
    expect(res.email).toEqual('email');
    expect(res.apiKey).toBeTruthy();
    expect(res.password).toBeTruthy();
    expect(res.plan).toEqual(Plan.STARTER);
  });

  it('posts new developer', async () => {
    const userData = { email: 'email', password: 'password', name: 'name' };
    const req = requestFixture({ body: userData });
    const res = responseFixture();
    const next = nextFunctionFixture();
    await postDeveloper(req, res, next);
    expect(res.send).toHaveBeenCalledWith({
      message: 'Success email sent to email',
      apiKey: 'generated-uuid',
      id: 'static',
    });
  });

  it('puts a developer', async () => {
    const userData = { email: 'email', firebaseId: 'firebaseId', name: 'name' };
    const req = requestFixture({ body: userData });
    const res = responseFixture();
    const next = nextFunctionFixture();
    await putDeveloper(req, res, next);
    expect(res.send).toHaveBeenCalledWith({
      message: 'Saved Developer account',
      developer: {
        id: 'static',
        type: 'static',
      },
    });
  });

  it('gets a developer', async () => {
    const userData = { email: 'email', firebaseId: 'firebaseId' };
    const req = requestFixture({ body: userData, params: { id: '6596b5d786c9fa24816fe294' } });
    const res = responseFixture();
    const next = nextFunctionFixture();
    await getDeveloper(req, res, next);
    expect(res.send).toHaveBeenCalled();
  });

  it('gets developer by email', async () => {
    const email = 'testing@email.com';
    expect(await getDeveloperByEmail(email)).toEqual({ id: 'static', type: 'static' });
  });
});
