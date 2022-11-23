import map from 'lodash/map';

export const getDocumentsIds = (documents) => map(documents, ({ id }) => id);
