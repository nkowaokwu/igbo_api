import chai from 'chai';
import chaiHttp from 'chai-http';
import {
  createExample,
  createWord,
  getExampleSuggestions,
  getGenericWords,
  getUsers,
  getWordSuggestions,
} from './shared/commands';
import { AUTH_TOKEN } from './shared/constants';

const { expect } = chai;

chai.use(chaiHttp);

describe('Auth', () => {
  describe('Authorization', () => {
    it('should allow an admin to see word suggestions', (done) => {
      getWordSuggestions({ role: 'admin' })
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.error).to.equal(undefined);
          done();
        });
    });

    it('should allow an admin to see generic words', (done) => {
      getGenericWords({ role: 'admin' })
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.error).to.equal(undefined);
          done();
        });
    });

    it('should allow an admin to see example suggestions', (done) => {
      getExampleSuggestions({ role: 'admin' })
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.error).to.equal(undefined);
          done();
        });
    });

    it('should allow an editor to see word suggestions', (done) => {
      getWordSuggestions({ role: 'editor' })
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.error).to.equal(undefined);
          done();
        });
    });

    it('should allow an editor to see generic words', (done) => {
      getGenericWords({ role: 'editor' })
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.error).to.equal(undefined);
          done();
        });
    });

    it('should allow an editor to see example suggestions', (done) => {
      getExampleSuggestions({ role: 'editor' })
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.error).to.equal(undefined);
          done();
        });
    });

    it('should forbid a regular user from seeing word suggestions', (done) => {
      getWordSuggestions({ role: 'user' })
        .end((_, res) => {
          expect(res.status).to.equal(403);
          expect(res.body.error).to.not.equal(undefined);
          done();
        });
    });

    it('should forbid a regular user from seeing generic words', (done) => {
      getGenericWords({ role: 'user' })
        .end((_, res) => {
          expect(res.status).to.equal(403);
          expect(res.body.error).to.not.equal(undefined);
          done();
        });
    });

    it('should forbid a regular user from seeing example suggestions', (done) => {
      getExampleSuggestions({ role: 'user' })
        .end((_, res) => {
          expect(res.status).to.equal(403);
          expect(res.body.error).to.not.equal(undefined);
          done();
        });
    });

    it('should forbid an editor from creating a word', (done) => {
      createWord('', { role: 'editor', uid: AUTH_TOKEN.EDITOR_AUTH_TOKEN })
        .end((_, res) => {
          expect(res.status).to.equal(403);
          expect(res.body.error).to.not.equal(undefined);
          done();
        });
    });

    it('should forbid an editor from creating an example', (done) => {
      createExample('', { role: 'editor', uid: AUTH_TOKEN.EDITOR_AUTH_TOKEN })
        .end((_, res) => {
          expect(res.status).to.equal(403);
          expect(res.body.error).to.not.equal(undefined);
          done();
        });
    });

    it.skip('should allow an admin to get all users', (done) => {
      getUsers()
        .end((_, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });

    it.skip('should forbid a non-admin from getting users', (done) => {
      getUsers({ role: 'merger' })
        .end((_, res) => {
          expect(res.status).to.equal(403);
          done();
        });
    });
  });
});
