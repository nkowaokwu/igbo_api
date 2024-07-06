import { createAuthorizationHeader, axios, postDeveloper, putDeveloper } from '../DevelopersAPI';

describe('DevelopersAPI', () => {
  it('creates an authorization header', async () => {
    const authorizationHeader = await createAuthorizationHeader();
    expect(authorizationHeader).toEqual('Bearer uid-id-token');
  });

  it('creates an axios request', async () => {
    const request = await axios({ data: 'payload', url: '/developers' });
    expect(request).toEqual({
      data: 'payload',
      headers: {
        Authorization: 'Bearer uid-id-token',
      },
      url: 'http://localhost:8080/developers',
    });
  });

  describe('Updating Developers', () => {
    it('POST', async () => {
      const res = await postDeveloper({ data: 'payload' });
      expect(res).toEqual({
        method: 'POST',
        url: 'http://localhost:8080/api/v1/developers',
        data: { data: 'payload' },
        headers: { Authorization: 'Bearer uid-id-token' },
      });
    });

    it('PUT', async () => {
      const res = await putDeveloper({ uid: 'uid', email: 'uid@gmail.com' });
      expect(res).toEqual({ firebaseId: 'uid', email: 'uid@gmail.com' });
    });
  });
});
