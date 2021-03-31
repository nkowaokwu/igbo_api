import chai from 'chai';
import chaiHttp from 'chai-http';
import {
  createDeveloper,
  getExample,
  getExamples,
  getWord,
  getWords,
} from './shared/commands';
import {
  developerData,
  malformedDeveloperData,
  wordId,
  exampleId,
} from './__mocks__/documentData';

const { expect } = chai;

chai.use(chaiHttp);

describe('Developers', () => {
  describe('/POST mongodb developers', () => {
    it('should create a new developer', (done) => {
      createDeveloper(developerData)
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.not.equal(undefined);
          done();
        });
    });

    it('should throw an error while creating a new developer', (done) => {
      createDeveloper(malformedDeveloperData)
        .end((_, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.not.equal(undefined);
          done();
        });
    });

    it('should throw an error by using the same email for new developers', (done) => {
      const repeatedDeveloper = {
        ...developerData,
        email: 'email@example.com',
      };
      createDeveloper(repeatedDeveloper)
        .then((res) => {
          expect(res.status).to.equal(200);
          createDeveloper(repeatedDeveloper)
            .end((_, result) => {
              expect(result.status).to.equal(400);
              expect(result.body.error).to.not.equal(undefined);
              done();
            });
        });
    });
  });

  describe('Using Developer API Keys', () => {
    it('should get all words with API key', (done) => {
      createDeveloper(developerData)
        .then((developerRes) => {
          expect(developerRes.status).to.equal(200);
          getWords({}, {}, { apiKey: developerRes.body.apiKey })
            .end((_, res) => {
              expect(res.status).to.equal(200);
              done();
            });
        });
    });

    it('should search for a word with API key', (done) => {
      createDeveloper(developerData)
        .then((developerRes) => {
          expect(developerRes.status).to.equal(200);
          getWord(wordId, {}, { apiKey: developerRes.body.apiKey })
            .end((_, res) => {
              expect(res.status).to.equal(404);
              done();
            });
        });
    });

    it('should get examples with API key', (done) => {
      createDeveloper(developerData)
        .then((developerRes) => {
          expect(developerRes.status).to.equal(200);
          getExamples({}, {}, { apiKey: developerRes.body.apiKey })
            .end((_, res) => {
              expect(res.status).to.equal(200);
              done();
            });
        });
    });

    it('should search for an example with API key', (done) => {
      createDeveloper(developerData)
        .then((developerRes) => {
          expect(developerRes.status).to.equal(200);
          getExample(exampleId, {}, { apiKey: developerRes.body.apiKey })
            .end((_, res) => {
              expect(res.status).to.equal(404);
              done();
            });
        });
    });

    it('should throw an error getting words with invalid API key', (done) => {
      getWords({}, { apiKey: 'invalid key' })
        .end((_, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.error).to.not.equal(undefined);
          done();
        });
    });

    it('should throw an error getting a word with invalid API key', (done) => {
      getWord(wordId, {}, { apiKey: 'invalid key' })
        .end((_, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.error).to.not.equal(undefined);
          done();
        });
    });

    it('should throw an error getting examples with invalid API key', (done) => {
      getExamples({}, { apiKey: 'invalid key' })
        .end((_, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.error).to.not.equal(undefined);
          done();
        });
    });

    it('should throw an error getting an example with invalid API key', (done) => {
      getExample(exampleId, {}, { apiKey: 'invalid key' })
        .end((_, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.error).to.not.equal(undefined);
          done();
        });
    });

    it('should throw no error getting examples with mismatching origin', (done) => {
      createDeveloper(developerData)
        .then((developerRes) => {
          expect(developerRes.status).to.equal(200);
          getExamples({}, { apiKey: developerRes.body.apiKey, origin: 'invalid' })
            .end((_, res) => {
              expect(res.status).to.equal(200);
              done();
            });
        });
    });

    it('should increase the count by maxing usage limit', (done) => {
      createDeveloper(developerData)
        .then((developerRes) => {
          expect(developerRes.status).to.equal(200);
          getWord(wordId, {}, { apiKey: developerRes.body.apiKey })
            .then(() => {
              getWord(wordId, {}, { apiKey: developerRes.body.apiKey })
                .then(() => {
                  getWord(wordId, { apiLimit: 2 }, { apiKey: developerRes.body.apiKey })
                    .then((res) => {
                      expect(res.status).to.equal(403);
                      done();
                    });
                });
            });
        });
    });
  });
});
