import { Types } from 'mongoose';
import { SuggestionSourceEnum } from '../../src/shared/constants/SuggestionSourceEnum';
import WordAttributeEnum from '../../src/shared/constants/WordAttributeEnum';
import { Example, Word } from '../../src/types';
import { WordDialect } from '../../src/types/word';
import { Flags } from '../../src/controllers/utils/types';
import { capitalize } from 'lodash';

interface RequestOptions {
  noAuthorizationHeader?: boolean;
}

export const wordFixture = (data?: Partial<Word>) => ({
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

export const exampleFixture = (data?: Partial<Example>) => ({
  id: `${new Types.ObjectId()}`,
  associatedDefinitionsSchemas: [],
  associatedWords: [],
  english: '',
  igbo: '',
  meaning: '',
  nsibidi: '',
  nsibidiCharacters: [],
  pronunciations: [],
  source: SuggestionSourceEnum.INTERNAL,
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
) => ({
  body,
  params,
  headers,
  query: {},
  get: (header: string) => headers[header] || headers[capitalize(header)],
});
export const statusSendMock = jest.fn();
export const responseFixture = () => ({
  status: jest.fn(() => ({ send: statusSendMock })),
  send: jest.fn(),
  redirect: jest.fn(),
});
export const nextFunctionFixture = () => jest.fn();
