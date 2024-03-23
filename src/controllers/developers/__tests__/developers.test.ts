import {
  requestFixture,
  responseFixture,
  nextFunctionFixture,
} from '../../../../__tests__/shared/fixtures';
import {
  getDeveloper,
  getDeveloperByFirebaseId,
  postDeveloper,
  postDeveloperHelper,
  putDeveloper,
} from '../../developers';
import { Model } from '../../../../__mocks__/mongoose';

class Developer {
  local = {};
  constructor(value: object) {
    this.local = value;
  }

  static find() {
    return [];
  }

  static findOne() {}

  save() {
    return this.local;
  }
}

describe('developers', () => {
  it('helps post a new developer', async () => {
    const userData = { email: 'email', password: 'password', name: 'name' };
    const res = await postDeveloperHelper({
      // @ts-expect-error Developer
      Developer,
      userData,
    });

    expect(res.name).toEqual('name');
    expect(res.email).toEqual('email');
    expect(res.apiKey).toBeTruthy();
    expect(res.password).toBeTruthy();
  });

  it('posts new developer', async () => {
    const userData = { email: 'email', password: 'password', name: 'name' };
    const req = requestFixture({ body: userData });
    const res = responseFixture();
    const next = nextFunctionFixture();
    // @ts-expect-error Args
    await postDeveloper(req, res, next);
    expect(res.send).toHaveBeenCalledWith({
      message: 'Success email sent to email',
      apiKey: 'generated-uuid',
    });
  });

  it('puts a developer', async () => {
    const userData = { email: 'email', firebaseId: 'firebaseId', displayName: 'name' };
    const req = requestFixture({ body: userData });
    const res = responseFixture();
    const next = nextFunctionFixture();
    // @ts-expect-error Args
    await putDeveloper(req, res, next);
    expect(res.send).toHaveBeenCalledWith({
      message: 'Saved Developer account',
      developer: {
        type: 'static',
      },
    });
  });

  it('gets a developer', async () => {
    const userData = { email: 'email', firebaseId: 'firebaseId' };
    const req = requestFixture({ body: userData, params: { id: '6596b5d786c9fa24816fe294' } });
    const res = responseFixture();
    const next = nextFunctionFixture();
    // @ts-expect-error Args
    await getDeveloper(req, res, next);
    expect(res.send).toHaveBeenCalled();
  });

  it('gets developer by firebase id', async () => {
    const firebaseId = 'firebaseId';
    expect(await getDeveloperByFirebaseId(firebaseId)).toEqual({ type: 'static' });
  });
});
