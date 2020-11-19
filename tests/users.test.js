import chai from 'chai';
import chaiHttp from 'chai-http';
import { getUsers } from './shared/commands';
import { AUTH_TOKEN } from './shared/constants';

const { expect } = chai;

chai.use(chaiHttp);

describe('Users', () => {
  describe('/GET firebase users', () => {
    it('should get all users with admin auth', (done) => {
      getUsers(AUTH_TOKEN.ADMIN_AUTH_TOKEN)
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.error).to.equal(undefined);
          done();
        });
    });

    it('should return an error because of invalid auth permissions of merger', (done) => {
      getUsers(AUTH_TOKEN.MERGER_AUTH_TOKEN)
        .end((_, res) => {
          expect(res.status).to.equal(403);
          expect(res.body.error).to.not.equal(undefined);
          done();
        });
    });

    it('should return an error because of invalid auth permissions of editor', (done) => {
      getUsers(AUTH_TOKEN.EDITOR_AUTH_TOKEN)
        .end((_, res) => {
          expect(res.status).to.equal(403);
          expect(res.body.error).to.not.equal(undefined);
          done();
        });
    });

    it('should return an error because of invalid auth permissions of user', (done) => {
      getUsers(AUTH_TOKEN.USER_AUTH_TOKEN)
        .end((_, res) => {
          expect(res.status).to.equal(403);
          expect(res.body.error).to.not.equal(undefined);
          done();
        });
    });

    it('should return an error with malformed auth token', (done) => {
      getUsers('')
        .end((_, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.not.equal(undefined);
          done();
        });
    });
  });
});
