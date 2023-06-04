interface Example {
  id: string,
  igbo?: string,
  english?: string,
  meaning?: string,
  nsibidi?: string,
  nsibidiCharacters: string[],
  associatedWords: string[],
  associatedDefinitionsSchemas: string[],
  pronunciations: {
    audio: string,
    speaker: string,
    review: boolean,
    approvals: string[],
    denials: string[],
    _id: string,
  }[],
  updatedAt: Date,
}

export default Example;
