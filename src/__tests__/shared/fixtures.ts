import LanguageEnum from '../../shared/constants/LanguageEnum';
import { SuggestionSourceEnum } from '../../shared/constants/SuggestionSourceEnum';
import WordClass from '../../shared/constants/WordClass';
import {
  Definition,
  IncomingExample,
  IncomingWord,
  DeveloperDocument,
  DeveloperUsage,
} from '../../types';
import { Types } from 'mongoose';
import AccountStatus from '../../shared/constants/AccountStatus';
import ApiType from '../../shared/constants/ApiType';
import Plan from '../../shared/constants/Plan';

export const documentId = new Types.ObjectId('569ed8269353e9f4c51617aa');

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

export const developerFixture = (developerData: Partial<DeveloperDocument>) => ({
  name: '',
  id: '',
  apiKey: '',
  email: '',
  password: '',
  usage: {
    date: new Date(),
    count: 0,
  },
  firebaseId: '',
  stripeId: '',
  plan: Plan.STARTER,
  accountStatus: AccountStatus.UNPAID,
  ...developerData,
});

export const developerUsageFixture = (developerFixture: Partial<DeveloperUsage>) => ({
  developerId: '',
  usageType: ApiType.DICTIONARY,
  usage: {
    date: new Date(),
    count: 0,
  },
  ...developerFixture,
});
