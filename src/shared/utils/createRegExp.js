import diacriticCodes from '../constants/diacriticCodes';

export default (searchWord, hardMatch = false) => {
  /* Front and back ensure the regexp will match with whole words */
  const front = '(?:^|[^a-zA-Z\u00c0-\u1ee5])';
  const back = '(?![a-zA-Z\u00c0-\u1ee5]+|,|s[a-zA-Z\u00c0-\u1ee5]+)';
  const regexWordStringNormalizedNFD = [...searchWord].reduce((regexWord, letter) => (
    `${regexWord}${diacriticCodes[letter] || letter}`
  ), '');
  const regexWordStringNormalizedNFC = [...searchWord].reduce((regexWord, letter) => (
    `${regexWord}${(diacriticCodes[letter] || letter).normalize('NFC')}`
  ), '');
  /* Hard match checks to see if the searchWord is the beginning and end of the line, triggered by strict query */
  return new RegExp(!hardMatch
    ? `(${front}${regexWordStringNormalizedNFD}${back})|(${front}${regexWordStringNormalizedNFC}${back})`
    : `(^${front}${regexWordStringNormalizedNFD}${back}$)|(^${front}$${regexWordStringNormalizedNFC}${back}$)`,
  'i');
};
