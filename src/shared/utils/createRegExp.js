import removeAccents from './removeAccents';
import diacriticCodes from '../constants/diacriticCodes';

const getIsLastLetterDuplicated = ({ stringArray, index, letter }) => {
  const previousLetter = stringArray[index - 1] || '';
  const isLastLetterDuplicated = index === stringArray.length - 1 && previousLetter === letter;
  return isLastLetterDuplicated;
};

export default (rawSearchWord, hardMatch = false) => {
  /* Front and back ensure the regexp will match with whole words */
  const front = '(?:^|[^a-zA-Z\u00c0-\u1ee5])';
  const back = '(?![a-zA-Z\u00c0-\u1ee5]+|,|s[a-zA-Z\u00c0-\u1ee5]+)';
  const searchWord = removeAccents.removeExcluding(rawSearchWord).normalize('NFC');
  const requirePluralAndGerundMatch = searchWord.endsWith('ing') && searchWord.replace('ing', '').length <= 1
    ? ''
    : '?';
  let regexWordString = [...(searchWord
    .replace(/(?:es|[s]|ing)$/, ''))];
  regexWordString = `${regexWordString
    .reduce((regexWord, letter, index) => {
      const isLastLetterDuplicated = getIsLastLetterDuplicated({
        stringArray: regexWordString,
        index,
        letter,
      });
      // eslint-disable-next-line max-len
      return `${regexWord}(${(diacriticCodes[letter] || letter)})${isLastLetterDuplicated ? '{0,}' : ''}`;
    }, '')}(?:es|[sx]|ing)${requirePluralAndGerundMatch}`;

  const startWordBoundary = '(\\W|^)';
  const endWordBoundary = '(\\W|$)';
  /* Hard match checks to see if the searchWord is the beginning and end of the line, triggered by strict query */
  const wordReg = new RegExp(!hardMatch
    ? `${startWordBoundary}(${front}${regexWordString})${endWordBoundary}`
    : `${startWordBoundary}(^${front}${regexWordString}${back}$)${endWordBoundary}`,
  'i');

  const definitionsReg = new RegExp(!hardMatch
    ? `${startWordBoundary}(${regexWordString})${endWordBoundary}`
    : `${startWordBoundary}(${regexWordString}$)${endWordBoundary}`,
  'i');

  return { wordReg, definitionsReg };
};
