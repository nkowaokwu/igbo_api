export type Example = {
  id: string;
  igbo?: string;
  english?: string;
  meaning?: string;
  nsibidi?: string;
  nsibidiCharacters: string[];
  associatedWords: string[];
  associatedDefinitionsSchemas: string[];
  pronunciations: Pronounciation[];
  updatedAt: Date;
};

export type Pronounciation = {
  audio: string;
  speaker: string;
  review: boolean;
  approvals: string[];
  denials: string[];
  _id: string;
};
