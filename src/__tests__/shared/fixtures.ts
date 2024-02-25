import WordClass from '../../shared/constants/WordClass';
import { Word, Definition } from '../../types';

export const wordFixture = (wordData: Partial<Word>) => ({
  definitions: [],
  dialects: [],
  tags: [],
  attributes: {
    isAccented: false,
    isBorrowedTerm: false,
    isCommon: false,
    isComplete: false,
    isConstructedTerm: false,
    isSlang: false,
    isStandardIgbo: false,
    isStem: false,
  },
  conceptualWord: '',
  examples: [],
  frequency: 1,
  hypernyms: [],
  hyponyms: [],
  pronunciation: '',
  relatedTerms: [],
  stems: [],
  id: '',
  updatedAt: new Date(),
  variations: [],
  word: '',
  wordPronunciation: '',
  ...wordData,
});

export const definitionFixture = (definitionData: Partial<Definition>) => ({
  wordClass: WordClass.NNC.value,
  definitions: [],
  igboDefinitions: [],
  nsibidi: '',
  nsibidiCharacters: [],
  ...definitionData,
});
