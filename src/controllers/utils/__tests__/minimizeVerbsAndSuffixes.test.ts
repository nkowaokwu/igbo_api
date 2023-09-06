import Version from '../../../shared/constants/Version';
import WordClass from '../../../shared/constants/WordClass';
import minimizeVerbsAndSuffixes from '../minimizeVerbsAndSuffixes';

describe('minimizeVerbsAndSuffixes', () => {
  it('minimizes the verbs and suffixes to include basic fields', () => {
    const words = [
      {
        word: 'first word',
        definitions: [{ wordClass: WordClass.NNC.value, definitions: [] }],
        stems: [],
        relatedTerms: [],
        id: '123',
      },
      {
        word: 'second word',
        definitions: [{ wordClass: WordClass.ADV.value, definitions: [] }],
        stems: [],
        relatedTerms: [],
        id: '456',
      },
      {
        word: 'third word',
        definitions: [{ wordClass: WordClass.PREP.value, definitions: [] }],
        stems: [],
        relatedTerms: [],
        id: '789',
      },
    ];
    const minimizedWords = minimizeVerbsAndSuffixes(words, Version.VERSION_2);
    expect(minimizedWords).toEqual({
      suffixes: [
        { word: 'first word', definitions: [{ wordClass: WordClass.NNC.value }] },
        { word: 'third word', definitions: [{ wordClass: WordClass.PREP.value }] },
      ],
      verbs: [{ word: 'second word', definitions: [{ wordClass: WordClass.ADV.value }] }],
    });
  });
});
