import WordClassEnum from '../../shared/constants/WordClassEnum';

export type Meta = {
  depth: number,
  isNegatorPrefixed?: boolean,
  isPreviousVerb?: boolean,
  isPreviousStativePrefix?: boolean,
  negativePrefix?: string,
  nominalPrefix?: boolean,
  negatorPrefixed?: boolean,
};

export type MinimizedWord = {
  word: string,
  definitions: { wordClass: WordClassEnum, nsibidi?: string }[],
};

export type WordData = {
  verbs?: MinimizedWord[],
  suffixes?: MinimizedWord[],
};

export type Solution = {
  type: { type: string, backgroundColor: string },
  text: string,
  wordClass: WordClassEnum[],
  wordInfo?: MinimizedWord,
};

export type TopSolution = { solution: Solution, metaData: Meta };

export type Keyword = {
  text: string,
  wordClass: WordClassEnum[],
  regex: {
    wordReg: RegExp,
    definitionsReg?: RegExp,
  },
};

export type Flags = {
  dialects: boolean,
  examples: boolean,
  style: string,
  resolve: boolean,
};
