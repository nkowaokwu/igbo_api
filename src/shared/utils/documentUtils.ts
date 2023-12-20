import map from 'lodash/map';
import { Word, Example } from '../../types';
import { ExampleWithPronunciation } from '../../controllers/types';

export const getDocumentsIds = (
  documents:
    | Partial<Word>
    | Partial<Example>
    | Partial<ExampleWithPronunciation>
    | Partial<Word>[]
    | Partial<Example>[]
    | Partial<ExampleWithPronunciation>[]
) => map(documents, ({ id }) => id);
