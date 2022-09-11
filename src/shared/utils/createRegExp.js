import diacriticCodes from '../constants/diacriticCodes';

export default (searchWord, hardMatch = false) => {
  /* Front and back ensure the regexp will match with whole words */
  const front = '(?:^|[^a-zA-Z\u00c0-\u1ee5])';
  const back = '(?![a-zA-Z\u00c0-\u1ee5]+|,|s[a-zA-Z\u00c0-\u1ee5]+)';
  const regexWordStringNormalizedNFD = `${[...(searchWord
    .replace(/(?:es|[s]|ing)$/, ''))]
    .reduce((regexWord, letter) => (
      `${regexWord}${diacriticCodes[letter] || letter}`
    ), '')}(?:es|[sx]|ing)?`;
  const regexWordStringNormalizedNFC = `${[...(searchWord
    .replace(/(?:es|[s]|ing)$/, ''))]
    .reduce((regexWord, letter) => (
      `${regexWord}${(diacriticCodes[letter] || letter).normalize('NFC')}`
    ), '')}(?:es|[sx]|ing)?`;

  // const wordBoundary = `\\${searchWord.match(/[ \']/) ? 'B' : 'b'}`; // eslint-disable-line no-useless-escape
  const startWordBoundary = '(\\W|^)';
  const endWordBoundary = '(\\W|$)';
  /* Hard match checks to see if the searchWord is the beginning and end of the line, triggered by strict query */
  return new RegExp(!hardMatch
    ? `${startWordBoundary}(${front}${regexWordStringNormalizedNFD})${endWordBoundary}`
    : `${startWordBoundary}(^${front}${regexWordStringNormalizedNFD}${back}$)${endWordBoundary}`
    + `|${startWordBoundary}(^${front}$${regexWordStringNormalizedNFC}${back}$)${endWordBoundary}`,
  'i');
};
