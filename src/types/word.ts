import { Example } from './example';

type WordClass = string | WordDialect;

interface DefinitionSchema {
  definitions: string[];
  id?: string;
  igboDefinitions: { igbo: string; nsibidi: string }[];
  nsibidi: string;
  nsibidiCharacters: string[];
  wordClass: WordClass;
}

interface WordDialect {
  dialects: string[];
  editor?: string;
  id: string;
  pronunciation: string;
  variations: string[];
  word: string;
}

interface Attriubute {
  isAccented: boolean;
  isBorrowedTerm: boolean;
  isCommon: boolean;
  isComplete: boolean;
  isConstructedTerm: boolean;
  isSlang: boolean;
  isStandardIgbo: boolean;
  isStem: boolean;
}

export interface Word {
  attributes: Attriubute;
  conceptualWord: string;
  definitions: [DefinitionSchema];
  dialects: WordDialect[];
  examples?: Example[];
  frequency: number;
  hypernyms: string[];
  hyponyms: string[];
  id: string;
  normalized: string;
  pronunciation: string;
  relatedTerms: string[];
  stems: string[];
  tags: string[];
  updatedAt: Date;
  variations: string[];
  word: string;
  wordClass: WordClass;
  wordPronunciation: string;
}
