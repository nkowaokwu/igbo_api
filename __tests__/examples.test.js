import forEach from 'lodash/forEach';
import has from 'lodash/has';
import isEqual from 'lodash/isEqual';
import { getExamples, getExample, getExamplesV2, getExampleV2 } from './shared/commands';
import { MAIN_KEY, EXAMPLE_KEYS_V1, EXAMPLE_KEYS_V2, INVALID_ID, NONEXISTENT_ID } from './shared/constants';
import { expectUniqSetsOfResponses } from './shared/utils';

describe('MongoDB Examples', () => {
  describe('/GET mongodb examples V1', () => {
    it('should return no examples by searching', async () => {
      const res = await getExamples();
      expect(res.status).toEqual(200);
      expect(res.body).toHaveLength(0);
    });

    it('should return an example by searching', async () => {
      const res = await getExamples({}, { apiKey: MAIN_KEY });
      expect(res.status).toEqual(200);
      expect(res.body.length).toBeLessThanOrEqual(10);
    });

    it('should return one example', async () => {
      const res = await getExamples({}, { apiKey: MAIN_KEY });
      const result = await getExample(res.body[0].id);
      expect(result.status).toEqual(200);
      EXAMPLE_KEYS_V1.forEach((key) => {
        expect(has(result.body, key)).toBeTruthy();
      });
    });

    it('should return an error for incorrect example id', async () => {
      await getExamples();
      const result = await getExample(NONEXISTENT_ID);
      expect(result.status).toEqual(404);
      expect(result.error).not.toEqual(undefined);
    });

    it("should return an error because document doesn't exist", async () => {
      const res = await getExample(INVALID_ID);
      expect(res.status).toEqual(400);
      expect(res.body.error).not.toEqual(undefined);
    });

    it('should return at most ten example per request with range query', async () => {
      const res = await Promise.all([
        getExamples({ range: '[0,9]' }),
        getExamples({ range: [10, 19] }),
        getExamples({ range: '[20,29]' }),
        getExamples({ range: '[30,39]' }),
      ]);
      expectUniqSetsOfResponses(res);
    });

    it('should return different sets of example suggestions for pagination', async () => {
      const res = await Promise.all([getExamples({ page: 0 }), getExamples({ page: 1 }), getExamples({ page: 2 })]);
      expectUniqSetsOfResponses(res);
    });

    it('should return prioritize range over page', async () => {
      const res = await Promise.all([
        getExamples({ page: '1' }, { apiKey: MAIN_KEY }),
        getExamples({ page: '1', range: '[100,109]' }, { apiKey: MAIN_KEY }),
      ]);
      expect(isEqual(res[0].body, res[1].body)).toEqual(false);
    });

    it('should return words with no keyword as an application using MAIN_KEY', async () => {
      const res = await getExamples({ apiKey: MAIN_KEY });
      expect(res.status).toEqual(200);
      expect(res.body.length).toBeLessThanOrEqual(10);
    });

    it('should return no examples with no keyword as a developer', async () => {
      const res = await getExamples();
      expect(res.status).toEqual(200);
      expect(res.body).toHaveLength(0);
    });

    it('should return accented keyword', async () => {
      const keyword = 'Òbìàgèlì bì n’Àba';
      const res = await getExamples({ keyword });
      expect(res.status).toEqual(200);
      forEach(res.body, (example) => {
        expect(example.igbo).not.toEqual(undefined);
      });
    });

    it('should return accented example', async () => {
      const res = await getExamples();
      expect(res.status).toEqual(200);
      forEach(res.body, (example) => {
        expect(example.igbo).not.toEqual(undefined);
      });
    });
  });

  describe('/GET mongodb examples V2', () => {
    it('should return one example', async () => {
      const res = await getExamplesV2({}, { apiKey: MAIN_KEY });
      const result = await getExampleV2(res.body.data[0].id);
      expect(result.status).toEqual(200);
      Object.keys(result.body.data).forEach((key) => {
        expect(EXAMPLE_KEYS_V2).toContain(key);
      });
    });
  });
});
