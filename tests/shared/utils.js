import chai from 'chai';
import {
  difference,
  forEach,
  map,
  every,
} from 'lodash';

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

const expectArrayIsInOrder = (array, key, direction = 'asc') => {
  const isOrdered = every(map(array, (item) => item[key]), (value, index) => {
    if (index === 0) {
      return true;
    }
    return (
      direction === 'asc'
        ? String(array[index - 1][key] <= String(value))
        : String(array[index - 1][key] >= String(value))
    );
  });
  expect(isOrdered).to.equal(true);
};

export {
  expectUniqSetsOfResponses,
  expectArrayIsInOrder,
};
