import { assign, omit, pick } from 'lodash';
import Version from '../../shared/constants/Version';

const minimizeVerbsAndSuffixes = (words, version) => {
  console.time('Minimize words');
  const minimizedWords = words.map((word) => {
    const minimizedWord = pick(assign(word), ['word', 'definitions']);
    minimizedWord.definitions =
      version === Version.VERSION_2
        ? (minimizedWord.definitions || []).map((definition) => pick(assign(definition), ['wordClass']))
        : minimizedWord.definitions;
    return minimizedWord;
  });
  console.timeEnd('Minimize words');
  return minimizedWords;
};

export default minimizeVerbsAndSuffixes;
