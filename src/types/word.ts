import { Document, Types } from 'mongoose';
import { IncomingExample } from './example';
import DialectEnum from '../shared/constants/DialectEnum';
import WordAttributeEnum from '../shared/constants/WordAttributeEnum';

type WordClass = string | WordDialect;

export interface Definition {
  definitions: string[];
  id?: string;
  igboDefinitions: { igbo: string, nsibidi: string }[];
  nsibidi: string;
  nsibidiCharacters: string[];
  wordClass: WordClass;
}

export interface WordDialect {
  dialects: DialectEnum[];
  editor?: string;
  id: string;
  pronunciation: string;
  variations: string[];
  word: string;
}

export interface LegacyWordDialect {
  [k: string]: WordDialect;
}

type Attribute = { [key in WordAttributeEnum]: boolean };

interface WordBase {
  attributes: Attribute;
  conceptualWord: string;
  frequency: number;
  hypernyms: string[];
  hyponyms: string[];
  pronunciation: string;
  relatedTerms: string[] | { id: string, _id?: Types.ObjectId }[];
  stems: string[] | { id: string, _id?: Types.ObjectId }[];
  id: string;
  updatedAt: Date;
  variations: string[];
  word: string;
  wordPronunciation: string;
}

export interface IncomingWord extends WordBase {
  definitions: Definition[];
  dialects: WordDialect[];
  tags: string[];
  examples?: IncomingExample[];
}

export interface IncomingLegacyWord extends WordBase {
  definitions: string[];
  wordClass: WordClass;
  nsibidi: string;
  dialects: LegacyWordDialect;
  examples?: IncomingExample[];
}

export interface OutgoingWord extends IncomingWord {}

export interface OutgoingLegacyWord extends IncomingLegacyWord {}

export type WordType = OutgoingWord | Document<OutgoingWord> | Document<OutgoingLegacyWord>;
export type PartialWordType =
  | Partial<OutgoingWord>
  | Document<Partial<OutgoingWord>>
  | Document<Partial<OutgoingLegacyWord>>;
