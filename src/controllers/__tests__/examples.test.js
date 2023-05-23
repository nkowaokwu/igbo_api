import { convertExamplePronunciations } from '../examples';

describe('examples', () => {
  it('converts example pronunciations to pronunciation for v1', () => {
    const example = {
      igbo: 'igbo',
      english: 'english',
      meaning: 'meaning',
      nsibidi: 'nsibidi',
      pronunciations: [{ audio: 'first audio', speaker: '' }],
    };

    expect(convertExamplePronunciations(example)).toEqual({
      igbo: 'igbo',
      english: 'english',
      meaning: 'meaning',
      nsibidi: 'nsibidi',
      pronunciation: 'first audio',
    });
  });
});
