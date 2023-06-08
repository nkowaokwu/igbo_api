import Example from './Example';

interface DefinitionSchema {
  wordClass: string | WordDialect,
  definitions: string[],
  igboDefinitions: { igbo: string, nsibidi: string }[],
  nsibidi: string,
  nsibidiCharacters: string[],
  id?: string,
}

interface WordDialect {
  dialects: string[],
  variations: string[],
  pronunciation: string,
  word: string,
  id: string,
  editor?: string,
}

interface Word {
  id: string,
  word: string,
  wordPronunciation: string,
  conceptualWord: string,
  definitions: [DefinitionSchema],
  dialects: WordDialect[],
  pronunciation: string,
  variations: string[],
  normalized: string,
  frequency: number,
  stems: string[],
  tags: string[],
  attributes: {
    isStandardIgbo: boolean,
    isAccented: boolean,
    isComplete: boolean,
    isSlang: boolean,
    isConstructedTerm: boolean,
    isBorrowedTerm: boolean,
    isStem: boolean,
    isCommon: boolean,
  }
  relatedTerms: string[],
  hypernyms: string[],
  hyponyms: string[],
  updatedAt: Date,
  examples?: Example[],
}

export default Word;
