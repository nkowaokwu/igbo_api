import {
  createDeveloper,
  getDeveloper,
  getExample,
  getExamples,
  getWord,
  getWords,
} from './shared/commands';
import { developerData, malformedDeveloperData, wordId, exampleId } from './__mocks__/documentData';

jest.unmock('mongoose');

// TODO: Re-enable test
describe.skip('Developers', () => {
  describe('/POST mongodb developers', () => {
    it('create a new developer', async () => {
      const res = await createDeveloper(developerData);
      expect(res.status).toEqual(200);
      expect(res.body.message).not.toEqual(undefined);
    });

    it('throw an error while creating a new developer', async () => {
      const res = await createDeveloper(malformedDeveloperData);
      expect(res.status).toEqual(400);
      expect(res.body.error).not.toEqual(undefined);
    });

    it('throw an error by using the same email for new developers', async () => {
      const repeatedDeveloper = {
        ...developerData,
        email: 'email@example.com',
      };
      const res = await createDeveloper(repeatedDeveloper);
      expect(res.status).toEqual(200);
      const result = await createDeveloper(repeatedDeveloper);
      expect(result.status).toEqual(400);
      expect(result.body.error).not.toEqual(undefined);
    });
  });

  describe('Using Developer API Keys', () => {
    it('get all words with API key', async () => {
      const developerRes = await createDeveloper(developerData);
      expect(developerRes.status).toEqual(200);
      await new Promise((resolve) => {
        setTimeout(resolve, 5000);
      });
      const res = await getWords({}, { apiKey: developerRes.body.apiKey });
      expect(res.status).toEqual(200);
    });

    it('search for a word with API key', async () => {
      const developerRes = await createDeveloper(developerData);
      expect(developerRes.status).toEqual(200);
      const res = await getWord(wordId, {}, { apiKey: developerRes.body.apiKey });
      expect(res.status).toEqual(404);
    });

    it('get examples with API key', async () => {
      const developerRes = await createDeveloper(developerData);
      expect(developerRes.status).toEqual(200);
      const res = await getExamples({}, { apiKey: developerRes.body.apiKey });
      expect(res.status).toEqual(200);
    });

    it('search for an example with API key', async () => {
      const developerRes = await createDeveloper(developerData);
      expect(developerRes.status).toEqual(200);
      const res = await getExample(exampleId, {}, { apiKey: developerRes.body.apiKey });
      expect(res.status).toEqual(404);
    });

    it('throw an error getting words with invalid API key', async () => {
      const res = await getWords({}, { apiKey: 'invalid key' });
      expect(res.status).toEqual(401);
      expect(res.body.error).not.toEqual(undefined);
    });

    it('throw an error getting a word with invalid API key', async () => {
      const res = await getWord(wordId, {}, { apiKey: 'invalid key' });
      expect(res.status).toEqual(401);
      expect(res.body.error).not.toEqual(undefined);
    });

    it('throw an error getting examples with invalid API key', async () => {
      const res = await getExamples({}, { apiKey: 'invalid key' });
      expect(res.status).toEqual(401);
      expect(res.body.error).not.toEqual(undefined);
    });

    it('throw an error getting an example with invalid API key', async () => {
      const res = await getExample(exampleId, {}, { apiKey: 'invalid key' });
      expect(res.status).toEqual(401);
      expect(res.body.error).not.toEqual(undefined);
    });

    it('throw no error getting examples with mismatching origin', async () => {
      const developerRes = await createDeveloper(developerData);
      expect(developerRes.status).toEqual(200);
      const res = await getExamples({}, { apiKey: developerRes.body.apiKey, origin: 'invalid' });
      expect(res.status).toEqual(200);
    });

    it('increase the count by maxing usage limit', async () => {
      const developerRes = await createDeveloper(developerData);
      expect(developerRes.status).toEqual(200);
      const wordsRes = await getWords({ keyword: 'eat' }, {});
      const limitWordId = wordsRes.body[0].id;
      await getWord(limitWordId, {}, { apiKey: developerRes.body.apiKey });
      await getWord(limitWordId, {}, { apiKey: developerRes.body.apiKey });
      const res = await getWord(limitWordId, { apiLimit: 2 }, { apiKey: developerRes.body.apiKey });
      expect(res.status).toEqual(403);
    });

    it('should return developer document with correct credentials', async () => {
      const developerRes = await createDeveloper(developerData);
      const developerDetailsRes = await getDeveloper(developerRes.body.id, {
        apiKey: developerRes.body.apiKey,
      });
      expect(developerDetailsRes.status).toEqual(200);
      expect(developerDetailsRes.body.developer).toMatchObject({
        usage: expect.objectContaining({
          date: expect.any(String),
          count: 0,
        }),
        name: expect.any(String),
        apiKey: expect.any(String),
        email: expect.any(String),
        password: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        id: expect.any(String),
      });
    });

    it('should throw an error getting developer document with invalid credentials', async () => {
      const developerRes = await createDeveloper(developerData);
      const res = await getDeveloper(developerRes.body.id, { apiKey: 'invalid api key' });
      expect(res.body.status).toEqual(403);
      expect(res.body.error).not.toEqual(undefined);
    });
  });
});
