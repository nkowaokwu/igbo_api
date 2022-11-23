import forEach from 'lodash/forEach';
import difference from 'lodash/difference';
import map from 'lodash/map';

export const expectUniqSetsOfResponses = (res, responseLength = 10) => {
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
