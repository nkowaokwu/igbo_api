import chai from 'chai';
import { difference, forEach, map } from 'lodash';

const { expect } = chai;

const expectUniqSetsOfResponses = (res) => {
  forEach(res, (docsRes, index) => {
    expect(docsRes.status).to.equal(200);
    expect(docsRes.body).to.have.lengthOf.at.most(10);
    if (index !== 0) {
      const prevDocsIds = map(res[index].body, ({ id }) => ({ id }));
      const currentDocsIds = map(docsRes.body, ({ id }) => ({ id }));
      expect(difference(prevDocsIds, currentDocsIds)).to.have.lengthOf(prevDocsIds.length);
    }
  });
};

export default expectUniqSetsOfResponses;
