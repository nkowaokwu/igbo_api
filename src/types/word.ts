import { Document, Types } from 'mongoose';
import { Example } from './example';
import DialectEnum from '../shared/constants/DialectEnum';
import WordAttributeEnum from '../shared/constants/WordAttributeEnum';

type WordClass = string | WordDialect;

export interface Definition {
  definitions: string[];
  id?: string;
  igboDefinitions: { igbo: string; nsibidi: string }[];
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

interface LegacyWordDialect {
  [k: string]: WordDialect;
}

type Attribute = {
  [key in WordAttributeEnum]: boolean;
};

interface WordBase {
  attributes: Attribute;
  conceptualWord: string;
  examples?: Example[];
  frequency: number;
  hypernyms: string[];
  hyponyms: string[];
  normalized: string;
  pronunciation: string;
  relatedTerms: string[] | { id: string; _id?: Types.ObjectId }[];
  stems: string[] | { id: string; _id?: Types.ObjectId }[];
  id: string;
  updatedAt: Date;
  variations: string[];
  word: string;
  wordPronunciation: string;
}

export interface Word extends WordBase {
  definitions: [Definition];
  dialects: WordDialect[];
  tags: string[];
}

export interface LegacyWord extends WordBase {
  definitions: string[];
  wordClass: WordClass;
  nsibidi: string;
  dialects: LegacyWordDialect;
}

export interface WordDocument extends Word, Document<any> {
  _id: Types.ObjectId;
  __v: number;
  id: string;
}

export interface LegacyWordDocument extends LegacyWord, Document<any> {
  _id: Types.ObjectId;
  __v: number;
  id: string;
}

export type WordType = Word | WordDocument | LegacyWordDocument;
export type PartialWordType = Partial<Word> | Partial<WordDocument> | Partial<LegacyWordDocument>;
