import { capitalize } from 'lodash';
import { WordDialect } from '../../types/word';
import { NextFunction, Request, Response } from 'express';
import { Flags } from '../../controllers/utils/types';
import LanguageEnum from '../../shared/constants/LanguageEnum';
import WordAttributeEnum from '../../shared/constants/WordAttributeEnum';
import { SuggestionSourceEnum } from '../../shared/constants/SuggestionSourceEnum';
import WordClass from '../../shared/constants/WordClass';
import {
  Definition,
  IncomingExample,
  IncomingWord,
  DeveloperDocument,
  DeveloperUsage,
  OutgoingExample,
  OutgoingWord,
} from '../../types';
import { Types } from 'mongoose';
import AccountStatus from '../../shared/constants/AccountStatus';
import ApiType from '../../shared/constants/ApiType';
import Plan from '../../shared/constants/Plan';

interface RequestOptions {
  noAuthorizationHeader?: boolean;
}

export const documentId = new Types.ObjectId('569ed8269353e9f4c51617aa');

export const incomingWordFixture = (wordData: Partial<IncomingWord>) => ({
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

export const incomingExampleFixture = (exampleData: Partial<IncomingExample>) => ({
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

export const outgoingWordFixture = (data?: Partial<OutgoingWord>) => ({
  attributes: Object.values(WordAttributeEnum).reduce(
    (finalAttributes, attribute) => ({ ...finalAttributes, [attribute]: false }),
    {}
  ),
  conceptualWord: '',
  frequency: 1,
  hypernyms: [],
  hyponyms: [],
  pronunciation: '',
  relatedTerms: [],
  stems: [],
  updatedAt: new Date(),
  variations: [],
  word: '',
  wordPronunciation: '',
  definitions: [],
  dialects: [],
  tags: [],
  id: `${new Types.ObjectId()}`,
  ...data,
});

export const outgoingExampleFixture = (data?: Partial<OutgoingExample>) => ({
  id: `${new Types.ObjectId()}`,
  associatedDefinitionsSchemas: [],
  associatedWords: [],
  source: { text: '', language: LanguageEnum.UNSPECIFIED, pronunciations: [] },
  translations: [{ text: '', language: LanguageEnum.UNSPECIFIED, pronunciations: [] }],
  meaning: '',
  nsibidi: '',
  nsibidiCharacters: [],
  pronunciations: [],
  origin: SuggestionSourceEnum.INTERNAL,
  updatedAt: new Date(),
  ...data,
});

export const dialectFixture = (data?: Partial<WordDialect>) => ({
  dialects: [],
  id: `${new Types.ObjectId()}`,
  pronunciation: '',
  variations: [],
  word: '',
  ...data,
});

export const flagsFixture = (data?: Partial<Flags>) => ({
  examples: false,
  dialects: false,
  resolve: false,
  style: '',
  ...data,
});

export const requestFixture = (
  {
    body = {},
    params = {},
    headers = {},
  }: {
    body?: { [key: string]: string },
    params?: { [key: string]: string },
    headers?: { [key: string]: string },
  } = {},
  options?: RequestOptions
): Request => ({
  body,
  params,
  headers,
  query: {},
  // @ts-expect-error get
  get: (header: string) => headers[header] || headers[capitalize(header)],
});
export const statusSendMock = jest.fn();
export const responseFixture = (): Response => ({
  // @ts-expect-error status
  status: jest.fn(() => ({ send: statusSendMock })),
  send: jest.fn(),
  redirect: jest.fn(),
});
export const nextFunctionFixture = (): NextFunction => jest.fn();
