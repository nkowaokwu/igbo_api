import { map } from 'lodash';

export const getDocumentsIds = (documents) => map(documents, ({ id }) => id);
