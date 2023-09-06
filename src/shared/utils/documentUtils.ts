import map from 'lodash/map';
import { Word, Example } from '../../types';
import { WithPronunciation } from '../../controllers/types';

export const getDocumentsIds = (
  documents:
    | Partial<Word>
    | Partial<Example>
    | Partial<WithPronunciation>
    | Partial<Word>[]
    | Partial<Example>[]
    | Partial<WithPronunciation>[]
) => map(documents, ({ id }) => id);
