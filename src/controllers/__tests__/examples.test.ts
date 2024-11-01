import { incomingExampleFixture } from '../../__tests__/shared/fixtures';
import LanguageEnum from '../../shared/constants/LanguageEnum';
import { convertToV1Example } from '../examples';

describe('examples', () => {
  it('converts example pronunciations to pronunciation for v1', () => {
    const example = incomingExampleFixture({
      source: {
        text: 'igbo',
        language: LanguageEnum.IGBO,
        pronunciations: [
          { audio: 'first audio', speaker: '', _id: '', approvals: [], denials: [], review: true },
        ],
      },
      translations: [{ text: 'english', language: LanguageEnum.ENGLISH, pronunciations: [] }],
      meaning: 'meaning',
      nsibidi: 'nsibidi',
    });

    expect(convertToV1Example(example)).toMatchObject({
      id: '',
      igbo: 'igbo',
      english: 'english',
      meaning: 'meaning',
      nsibidi: 'nsibidi',
      pronunciation: 'first audio',
      associatedDefinitionsSchemas: [],
      associatedWords: [],
      nsibidiCharacters: [],
    });
  });
});
