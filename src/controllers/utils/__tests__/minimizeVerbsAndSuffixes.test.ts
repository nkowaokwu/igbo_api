import Version from '../../../shared/constants/Version';
import WordClass from '../../../shared/constants/WordClass';
import { definitionFixture, incomingWordFixture } from '../../../__tests__/shared/fixtures';
import minimizeVerbsAndSuffixes from '../minimizeVerbsAndSuffixes';
import WordClassEnum from '../../../shared/constants/WordClassEnum';

describe('minimizeVerbsAndSuffixes', () => {
  it('minimizes the verbs and suffixes to include basic fields', () => {
    const words = [
      incomingWordFixture({
        word: 'first word',
        definitions: [definitionFixture({})],
        stems: [],
        relatedTerms: [],
        id: '123',
      }),
      incomingWordFixture({
        word: 'second word',
        definitions: [definitionFixture({ wordClass: WordClassEnum.ADV })],
        stems: [],
        relatedTerms: [],
        id: '456',
      }),
      incomingWordFixture({
        word: 'third word',
        definitions: [definitionFixture({ wordClass: WordClassEnum.PREP })],
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
