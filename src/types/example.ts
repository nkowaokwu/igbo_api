import { Document, Types } from 'mongoose';
import { SuggestionSourceEnum } from '../shared/constants/SuggestionSourceEnum';
import LanguageEnum from '../shared/constants/LanguageEnum';

type ExampleBase = {
  associatedDefinitionsSchemas: string[],
  associatedWords: string[],
  meaning: string,
  nsibidi: string,
  nsibidiCharacters: string[],
  origin: SuggestionSourceEnum,
};

export type IncomingExample = ExampleBase & {
  source: Translation,
  translations: Translation[],
};

export type OutgoingExample = IncomingExample & {};

export type OutgoingLegacyExample = ExampleBase & {
  igbo: string,
  english: string,
  pronunciation: string,
};

type Translation = {
  language: LanguageEnum,
  text: string,
  pronunciations: Pronunciation[],
};

type Pronunciation = {
  _id: string,
  approvals: string[],
  audio: string,
  denials: string[],
  review: boolean,
  speaker: string,
};

export interface ExampleDocument extends IncomingExample, Document {
  _id: Types.ObjectId;
  __v: number;
  id: string;
}
