/* Code inspired by goodyduru/igbo-text: https://github.com/goodyduru/igbo-text */
import forEach from 'lodash/forEach';
import unicharadata from 'unicharadata';

/* Removes all periods and numbers */
const clean = (text) => {
  if (!text) {
    return '';
  }
  return text.replace(/[0-9+.]/g, '').trim();
};

const removeTonalMarks = (text) => (
  [...text].reduce((textCharacters, letter) => {
    if (letter.charCodeAt() > 128 && letter.charCodeAt() < 300) {
      const normalizedLetter = letter.normalize('NFD').replace(/[\u0300-\u036f]/, '');
      return `${textCharacters}${normalizedLetter}`;
    }
    if (unicharadata.category(letter) !== 'Mn') {
      return `${textCharacters}${letter}`;
    }
    return textCharacters;
  }, '')
);

const removeDigitsAndSpecialCharacters = (text, removeAbbreviations) => {
  let updatedText = text;
  if (removeAbbreviations) {
    updatedText = updatedText.replace(/(?:[a-zA-Z]\.){2,}/, '');
  }
  updatedText = updatedText.replace(/([?.!,¿])/, / \1/);
  const regExp = /[a-zA-ZỊịṄṅỌọỤụ\-'’]+/;
  const wordTokens = updatedText.split(' ');
  const validWords = [];
  forEach(wordTokens, (wordToken) => {
    const matches = wordToken.match(regExp);
    if (matches && matches.length) {
      forEach(matches, (match) => validWords.push(match));
    }
  });
  return validWords.join(' ');
};

const splitCombinedWords = (text, keySymbols = true) => {
  let updatedText = text;
  if (keySymbols) {
    updatedText = updatedText.replace(/([-’'])/, /\1 /);
  } else {
    /* Removes prefixed '-' that denotes the current term is a suffix */
    // updatedText = updatedText.replace(/([-’'])/, ' ');
  }
  return updatedText;
};

const normalize = (text, convertToLower = true, removeAbbreviations = true) => {
  let normalizeText = text;
  if (!normalizeText) {
    return '';
  }

  if (convertToLower) {
    normalizeText = normalizeText.toLowerCase();
  }

  normalizeText = removeTonalMarks(normalizeText);
  normalizeText = removeDigitsAndSpecialCharacters(normalizeText, removeAbbreviations);
  normalizeText = splitCombinedWords(normalizeText, false);
  return normalizeText.trim();
};

const spaceOutSymbols = (text) => {
  let updatedText = text.replace(/([?.!:;,¿<>(){}[\]])/, / \1 /);
  updatedText = updatedText.replace(/\s+([-'"‘’“”])/, / \1 /);
  updatedText = updatedText.replace(/([-'"‘’“”])\s+/, / \1 /);
  updatedText = updatedText.replace(/([-'"‘’“”])$/, / \1/);
  updatedText = updatedText.replace(/^([-'"‘’“”])/, /\1 /);
  return updatedText;
};

const tokenize = (text, convertToLower = false) => {
  let tokenizedText = text;
  if (!tokenizedText) {
    throw new Error('Text is invalid');
  }
  if (convertToLower) {
    tokenizedText.toLowerCase();
  }
  tokenizedText = removeTonalMarks(tokenizedText);
  tokenizedText = spaceOutSymbols(tokenizedText);
  tokenizedText = splitCombinedWords(tokenizedText);
  const wordTokens = tokenizedText.trim().split(' ');
  return wordTokens;
};

// const normalizedText = normalize('N’ụlọ Akwụkwọà');
// const tokenizedText = tokenize(normalizedText);

// console.log({ normalizedText, tokenizedText });

export { clean, normalize, tokenize };
