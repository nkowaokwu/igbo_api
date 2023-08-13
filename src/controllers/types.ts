import { Example, LegacyWordDocument, Word, WordDocument } from '../types';

type ResponseData = {
  contentLength: number;
};

export type WithPronunciation = Omit<Example, 'pronunciations'> & {
  pronunciation: string;
};

export interface ExampleResponseData extends ResponseData {
  examples: Example[] | WithPronunciation[];
}

export interface WordResponseData extends ResponseData {
  words: Partial<Word | WordDocument | LegacyWordDocument>[];
}
