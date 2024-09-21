import { Document } from 'mongoose';
import { OutgoingExample, OutgoingLegacyExample, OutgoingWord, OutgoingLegacyWord } from '../types';

type ResponseData = {
  contentLength: number,
};

export interface ExampleResponseData extends ResponseData {
  examples: OutgoingExample[] | OutgoingLegacyExample[];
}

export interface WordResponseData extends ResponseData {
  words: Partial<OutgoingWord | Document<OutgoingWord> | Document<OutgoingLegacyWord>>[];
}

export type Filters = {
  tags?: { $in: string[] },
  'definitions.wordClass'?: { $in: string[] },
};
