import chai from 'chai';
import { isEqual } from 'lodash';
import { getExamples } from './shared/commands';
import { LONG_TIMEOUT } from './shared/constants';
import expectUniqSetsOfResponses from './shared/utils';

const { expect } = chai;

describe('MongoDB Examples', () => {
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
