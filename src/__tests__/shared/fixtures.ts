import LanguageEnum from '../../shared/constants/LanguageEnum';
import { SuggestionSourceEnum } from '../../shared/constants/SuggestionSourceEnum';
import WordClass from '../../shared/constants/WordClass';
import { Definition, IncomingExample, IncomingWord } from '../../types';

export const wordFixture = (wordData: Partial<IncomingWord>) => ({
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

export const exampleFixture = (exampleData: Partial<IncomingExample>) => ({
  source: { text: '', language: LanguageEnum.UNSPECIFIED, pronunciations: [] },
  translations: [{ text: '', language: LanguageEnum.UNSPECIFIED, pronunciations: [] }],
  meaning: '',
  nsibidi: '',
  id: '',
  associatedDefinitionsSchemas: [],
  associatedWords: [],
  nsibidiCharacters: [],
  updatedAt: new Date(),
  origin: SuggestionSourceEnum.INTERNAL,
  ...exampleData,
});
