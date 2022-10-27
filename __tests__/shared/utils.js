import {
  difference,
  forEach,
  map,
  every,
} from 'lodash';
import SortingDirections from '../../src/shared/constants/sortingDirections';

const expectUniqSetsOfResponses = (res, responseLength = 10) => {
  forEach(res, (docsRes, index) => {
    expect(docsRes.status).toEqual(200);
    expect(docsRes.body.length).toBeLessThanOrEqual(responseLength);
    if (index !== 0) {
      const prevDocsIds = map(res[index].body, ({ id }) => ({ id }));
      const currentDocsIds = map(docsRes.body, ({ id }) => ({ id }));
      expect(difference(prevDocsIds, currentDocsIds)).toHaveLength(prevDocsIds.length);
    }
  });
};

const expectArrayIsInOrder = (array, key, direction = SortingDirections.ASCENDING) => {
  const isOrdered = every(map(array, (item) => item[key]), (value, index) => {
    if (index === 0) {
      return true;
    }
    return (
      direction === SortingDirections.ASCENDING
        ? String(array[index - 1][key] <= String(value))
        : String(array[index - 1][key] >= String(value))
    );
  });
  expect(isOrdered).toEqual(true);
};

export {
  expectUniqSetsOfResponses,
  expectArrayIsInOrder,
};
