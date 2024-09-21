import map from 'lodash/map';
import { OutgoingWord, OutgoingExample, OutgoingLegacyExample } from '../../types';

export const getDocumentsIds = (
  documents:
    | Partial<OutgoingWord>
    | Partial<OutgoingExample>
    | Partial<OutgoingLegacyExample>
    | Partial<OutgoingWord>[]
    | Partial<OutgoingExample>[]
    | Partial<OutgoingLegacyExample>[],
) => map(documents, ({ id }) => id);
