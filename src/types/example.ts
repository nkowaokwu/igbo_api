import { Document, Types } from 'mongoose';
import { SuggestionSourceEnum } from '../shared/constants/SuggestionSourceEnum';
import LanguageEnum from '../shared/constants/LanguageEnum';

export type Example = {
  id: string,
  associatedDefinitionsSchemas: string[],
  associatedWords: string[],
  english?: string,
  igbo?: string,
  source?: Translation,
  translations?: Translation[],
  meaning?: string,
  nsibidi?: string,
  nsibidiCharacters: string[],
  pronunciations: Pronunciation[],
  origin?: SuggestionSourceEnum,
  updatedAt: Date,
};

type Translation = {
  _id: string,
  language: LanguageEnum,
  text: string,
};

type Pronunciation = {
  _id: string,
  approvals: string[],
  audio: string,
  denials: string[],
  review: boolean,
  speaker: string,
};

export interface ExampleDocument extends Example, Document<any> {
  _id: Types.ObjectId;
  __v: number;
  id: string;
}
