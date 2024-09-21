import { Types } from 'mongoose';
import { capitalize } from 'lodash';
import { NextFunction, Request, Response } from 'express';
import { SuggestionSourceEnum } from '../../src/shared/constants/SuggestionSourceEnum';
import WordAttributeEnum from '../../src/shared/constants/WordAttributeEnum';
import { OutgoingExample, OutgoingWord } from '../../src/types';
import { WordDialect } from '../../src/types/word';
import { Flags } from '../../src/controllers/utils/types';
import LanguageEnum from '../../src/shared/constants/LanguageEnum';

interface RequestOptions {
  noAuthorizationHeader?: boolean;
}

export const wordFixture = (data?: Partial<OutgoingWord>) => ({
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

export const exampleFixture = (data?: Partial<OutgoingExample>) => ({
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
