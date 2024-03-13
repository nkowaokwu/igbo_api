import { Example, LegacyWordDocument, Word, WordDocument } from '../types';

type ResponseData = {
  contentLength: number;
};

export type ExampleWithPronunciation = Omit<Example, 'pronunciations'> & {
  pronunciation: string;
};

export interface ExampleResponseData extends ResponseData {
  examples: Example[] | ExampleWithPronunciation[];
}

export interface WordResponseData extends ResponseData {
  words: Partial<Word | WordDocument | LegacyWordDocument>[];
}

export type Filters = {
  tags?: { $in: string[] };
  'definitions.wordClass'?: { $in: string[] };
};
