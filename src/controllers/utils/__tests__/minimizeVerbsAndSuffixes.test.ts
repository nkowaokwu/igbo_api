import Version from '../../../shared/constants/Version';
import WordClass from '../../../shared/constants/WordClass';
import { definitionFixture, wordFixture } from '../../../__tests__/shared/fixtures';
import minimizeVerbsAndSuffixes from '../minimizeVerbsAndSuffixes';

describe('minimizeVerbsAndSuffixes', () => {
  it('minimizes the verbs and suffixes to include basic fields', () => {
    const definition = definitionFixture({});
    const words = [
      wordFixture({
        word: 'first word',
        definitions: [definition],
        stems: [],
        relatedTerms: [],
        id: '123',
      }),
      wordFixture({
        word: 'second word',
        definitions: [definition],
        stems: [],
        relatedTerms: [],
        id: '456',
      }),
      wordFixture({
        word: 'third word',
        definitions: [definition],
        stems: [],
        relatedTerms: [],
        id: '789',
      }),
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
