import { Types } from 'mongoose';
import { SuggestionSourceEnum } from '../../src/shared/constants/SuggestionSourceEnum';
import WordAttributeEnum from '../../src/shared/constants/WordAttributeEnum';
import { Example, IgboAPIRequest, Word } from '../../src/types';
import { WordDialect } from '../../src/types/word';
import { Flags } from '../../src/controllers/utils/types';
import { HeapStatistics } from 'v8';

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
  { body, params }: { body: { [key: string]: string }, params?: { [key: string]: string } },
  options?: RequestOptions
) => ({
  body,
  params,
  headers: {},
  query: {},
});
export const responseFixture = () => ({
  send: jest.fn(),
});
export const nextFunctionFixture = () => jest.fn();
