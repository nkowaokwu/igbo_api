import { assign, pick } from 'lodash';
import Version from '../../shared/constants/Version';
import { Word } from '../../types';
import WordClassEnum from '../../shared/constants/WordClassEnum';
import { MinimizedWord } from './types';

const isVerb = (wordClass: WordClassEnum) =>
  wordClass === WordClassEnum.ADV ||
  wordClass === WordClassEnum.AV ||
  wordClass === WordClassEnum.PV ||
  wordClass === WordClassEnum.MV;

const minimizeVerbsAndSuffixes = (words: Word[], version: Version) => {
  const minimizedWords = words.reduce(
    (finalVerbsAndSuffixes, word) => {
      const minimizedWord = pick(assign(word), ['word', 'definitions']) as MinimizedWord;
      minimizedWord.definitions =
        version === Version.VERSION_2
          ? (minimizedWord.definitions || []).map((definition) => pick(assign(definition), ['wordClass']))
          : minimizedWord.definitions;
      if (minimizedWord.definitions.some(({ wordClass }) => isVerb(wordClass))) {
        finalVerbsAndSuffixes.verbs.push(minimizedWord);
      } else {
        finalVerbsAndSuffixes.suffixes.push(minimizedWord);
      }
      return finalVerbsAndSuffixes;
    },
    { verbs: [], suffixes: [] } as { verbs: MinimizedWord[]; suffixes: MinimizedWord[] }
  );
  return minimizedWords;
};

export default minimizeVerbsAndSuffixes;
