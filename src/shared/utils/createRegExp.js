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
  const regexStringBase = [...(searchWord
    .replace(/(?:es|[s]|ing)$/, ''))];
  const regexWordString = `${regexStringBase
    .reduce((regexWord, letter, index) => {
      const isLastLetterDuplicated = getIsLastLetterDuplicated({
        stringArray: regexStringBase,
        index,
        letter,
      });
      // eslint-disable-next-line max-len
      return `${regexWord}(${(diacriticCodes[letter] || letter)})${isLastLetterDuplicated ? '{0,}' : ''}`;
    }, '')}(?:es|[sx]|ing)${requirePluralAndGerundMatch}`;
  const hardRegexWordString = searchWord.length
    ? `${[...searchWord]
      .reduce((regexWord, letter, index) => {
        const isLastLetterDuplicated = getIsLastLetterDuplicated({
          stringArray: regexStringBase,
          index,
          letter,
        });
        // eslint-disable-next-line max-len
        return `${regexWord}(${(diacriticCodes[letter] || letter)})${isLastLetterDuplicated ? '{0,}' : ''}`;
      }, '')}${requirePluralAndGerundMatch}`
    : '';

  const startWordBoundary = '(\\W|^)';
  const endWordBoundary = '(\\W|$)';
  /* Hard match checks to see if the searchWord is the beginning and end of the line, triggered by strict query */
  const wordReg = new RegExp(!hardMatch
    ? `${startWordBoundary}(${front}${regexWordString})${endWordBoundary}`
    : `${startWordBoundary}(^${front}${regexWordString}${back}$)${endWordBoundary}`,
  'i');

  const definitionsReg = new RegExp(`${startWordBoundary}(${regexWordString})${endWordBoundary}`, 'i');
  const hardDefinitionsReg = new RegExp(`${startWordBoundary}(${hardRegexWordString})${endWordBoundary}`, 'i');

  return {
    wordReg,
    definitionsReg,
    hardDefinitionsReg,
  };
};
