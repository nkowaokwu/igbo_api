import diacriticCodes from '../constants/diacriticCodes';

export default (searchWord) => {
  /* front and back ensure the regexp will match with whole words */
  const front = '(?:^|[^a-zA-Z\u00c0-\u1ee5])';
  const back = '(?![a-zA-Z\u00c0-\u1ee5]+|,|s[a-zA-Z\u00c0-\u1ee5]+)';
  const regexWordString = [...searchWord].reduce((regexWord, letter) => (
    `${regexWord}${diacriticCodes[letter] || letter}`
  ), '');
  return new RegExp(`${front}${regexWordString}${back}`);
};
