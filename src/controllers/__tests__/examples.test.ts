import { expect } from '@jest/globals';
import { exampleFixture } from '../../__tests__/shared/fixtures';
import { convertExamplePronunciations } from '../examples';

describe('examples', () => {
  it('converts example pronunciations to pronunciation for v1', () => {
    const updatedAt = new Date();
    const example = exampleFixture({
      igbo: 'igbo',
      english: 'english',
      meaning: 'meaning',
      nsibidi: 'nsibidi',
      pronunciations: [
        { audio: 'first audio', speaker: '', _id: '', approvals: [], denials: [], review: true },
      ],
      updatedAt,
    });

    expect(convertExamplePronunciations(example)).toEqual({
      id: '',
      igbo: 'igbo',
      english: 'english',
      meaning: 'meaning',
      nsibidi: 'nsibidi',
      pronunciation: 'first audio',
      associatedDefinitionsSchemas: [],
      associatedWords: [],
      nsibidiCharacters: [],
      updatedAt,
    });
  });
});
