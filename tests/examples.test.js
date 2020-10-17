import chai from 'chai';
import { isEqual, some } from 'lodash';
import { createExample, getExamples } from './shared/commands';
import { LONG_TIMEOUT } from './shared/constants';
import expectUniqSetsOfResponses from './shared/utils';
import { exampleSuggestionData, malformedWordSuggestionData } from './__mocks__/documentData';

const { expect } = chai;

describe('MongoDB Examples', () => {
  describe('/POST mongodb examples', () => {
    it('should create a new example in the database', (done) => {
      createExample(exampleSuggestionData)
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.id).to.not.equal(undefined);
          done();
        });
    });

    it('should throw an error for malformed new example data', (done) => {
      createExample(malformedWordSuggestionData)
        .end((_, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.not.equal(undefined);
          done();
        });
    });

    it('should return newly created example by searching with keyword', (done) => {
      createExample(exampleSuggestionData)
        .then((res) => {
          expect(res.status).to.equal(200);
          expect(res.body.id).to.not.equal(undefined);
          getExamples({ keyword: exampleSuggestionData.igbo })
            .end((_, result) => {
              expect(res.status).to.equal(200);
              console.log(result.body);
              expect(some(result.body, (example) => example.igbo === exampleSuggestionData.igbo)).to.equal(true);
              done();
            });
        });
    });
  });

  describe('/GET mongodb examples', () => {
    it('should return an example by searching', (done) => {
      getExamples()
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.lengthOf.at.most(10);
          done();
        });
    });

    it('should return at most ten example per request with range query', function (done) {
      this.timeout(LONG_TIMEOUT);
      Promise.all([
        getExamples({ range: '[0,9]' }),
        getExamples({ range: '[10,19]' }),
        getExamples({ range: '[20,29' }),
      ]).then((res) => {
        expectUniqSetsOfResponses(res);
        done();
      });
    });

    it('should return different sets of example suggestions for pagination', (done) => {
      Promise.all([
        getExamples(0),
        getExamples(1),
        getExamples(2),
      ]).then((res) => {
        expectUniqSetsOfResponses(res);
        done();
      });
    });

    it('should return prioritize page over range', (done) => {
      Promise.all([
        getExamples({ page: '1' }),
        getExamples({ page: '1', range: '[100,109]' }),
      ]).then((res) => {
        expect(isEqual(res[0].body, res[1].body)).to.equal(true);
        done();
      });
    });
  });
});
