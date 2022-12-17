import diacriticCodes from '../constants/diacriticCodes';

const getIsLastLetterDuplicated = ({ stringArray, index, letter }) => {
  const previousLetter = stringArray[index - 1] || '';
  const isLastLetterDuplicated = index === stringArray.length - 1 && previousLetter === letter;
  return isLastLetterDuplicated;
};

export default (searchWord, hardMatch = false) => {
  /* Front and back ensure the regexp will match with whole words */
  const front = '(?:^|[^a-zA-Z\u00c0-\u1ee5])';
  const back = '(?![a-zA-Z\u00c0-\u1ee5]+|,|s[a-zA-Z\u00c0-\u1ee5]+)';
  const requirePluralAndGerundMatch = searchWord.endsWith('ing') && searchWord.replace('ing', '').length <= 1
    ? ''
    : '?';
  let regexWordStringNormalizedNFD = [...(searchWord
    .replace(/(?:es|[s]|ing)$/, ''))];
  regexWordStringNormalizedNFD = `${regexWordStringNormalizedNFD
    .reduce((regexWord, letter, index) => {
      const isLastLetterDuplicated = getIsLastLetterDuplicated({
        stringArray: regexWordStringNormalizedNFD,
        index,
        letter,
      });
      // eslint-disable-next-line max-len
      return `${regexWord}(${(diacriticCodes[letter] || letter).normalize('NFD')})${isLastLetterDuplicated ? '{0,}' : ''}`;
    }, '')}(?:es|[sx]|ing)${requirePluralAndGerundMatch}`;
  let regexWordStringNormalizedNFC = [...(searchWord
    .replace(/(?:es|[s]|ing)$/, ''))];
  regexWordStringNormalizedNFC = `${regexWordStringNormalizedNFC
    .reduce((regexWord, letter, index) => {
      const isLastLetterDuplicated = getIsLastLetterDuplicated({
        stringArray: regexWordStringNormalizedNFD,
        index,
        letter,
      });
      return (
        `${regexWord}(${(diacriticCodes[letter] || letter).normalize('NFC')})${isLastLetterDuplicated ? '{0,}' : ''}`
      );
    }, '')}(?:es|[sx]|ing)${requirePluralAndGerundMatch}`;

  const startWordBoundary = '(\\W|^)';
  const endWordBoundary = '(\\W|$)';
  /* Hard match checks to see if the searchWord is the beginning and end of the line, triggered by strict query */
  const wordReg = new RegExp(!hardMatch
    ? `${startWordBoundary}(${front}${regexWordStringNormalizedNFD})${endWordBoundary}`
    + `|${startWordBoundary}(${front}${regexWordStringNormalizedNFC})${endWordBoundary}`
    : `${startWordBoundary}(^${front}${regexWordStringNormalizedNFD}${back}$)${endWordBoundary}`
    + `|${startWordBoundary}(^${front}${regexWordStringNormalizedNFC}${back}$)${endWordBoundary}`,
  'i');

  const definitionsReg = new RegExp(!hardMatch
    ? `${startWordBoundary}(${regexWordStringNormalizedNFD})${endWordBoundary}`
    + `|${startWordBoundary}(${regexWordStringNormalizedNFC})${endWordBoundary}`
    : `${startWordBoundary}(${regexWordStringNormalizedNFD}$)${endWordBoundary}`
    + `|${startWordBoundary}(${regexWordStringNormalizedNFC}$)${endWordBoundary}`,
  'i');

  return { wordReg, definitionsReg };
};
