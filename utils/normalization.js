/* Code inspired by goodyduru/igbo-text: https://github.com/goodyduru/igbo-text */

import unicharadata from 'unicharadata';
/* Removes all periods and numbers */
const clean = (text) => {
    if (!text) {
        return '';
    }
    return text.replace(/[0-9+.]/g, '').trim();
};

const normalize = (text, convertToLower = true, removeAbbreviations = true) => {
    if (!text) {
        return '';
    }

    if (convertToLower) {
        text = text.toLowerCase();
    }

    text = removeTonalMarks(text);
    text = removeDigitsAndSpecialCharacters(text, removeAbbreviations);
    text = splitCombinedWords(text, false);
    return text.trim();
};

const removeTonalMarks = (text) => {
    return [...text].reduce((textCharacters, letter) => {
        if (letter.charCodeAt() > 128 && letter.charCodeAt() < 300) {
            const normalizedLetter = letter.normalize('NFD').replace(/[\u0300-\u036f]/, '');
            return `${textCharacters}${normalizedLetter}`;
        } else if (unicharadata.category(letter) !== 'Mn') {
            return `${textCharacters}${letter}`;
        }
        return textCharacters;
    }, '');
};

const removeDigitsAndSpecialCharacters = (text, removeAbbreviations) => {
    let updatedText = text;
    if (removeAbbreviations) {
        updatedText = updatedText.replace(/(?:[a-zA-Z]\.){2,}/, '');
    }
    updatedText = updatedText.replace(/([?.!,¿])/, / \1/);
    const regExp = /[a-zA-ZỊịṄṅỌọỤụ\-'’]+/;
    const wordTokens = updatedText.split(' ');
    const validWords = [];
    for (const wordToken of wordTokens) {
        const matches = wordToken.match(regExp);
        if (matches && matches.length) {
            matches.forEach((match) => validWords.push(match));
        }
    }
    return validWords.join(' ');
};

const tokenize = (text, convertToLower = false) => {
    if (!text) {
        throw new Error('Text is invalid');
    }
    if (convertToLower) {
        text.toLowerCase();
    }
    text = removeTonalMarks(text);
    text = spaceOutSymbols(text);
    text = splitCombinedWords(text);
    const wordTokens = text.trim().split(' ');
    return wordTokens;
}; 

const splitCombinedWords = (text, keySymbols = true) => {
    let updatedText = text;
    if (keySymbols) {
        updatedText = updatedText.replace(/([-’'])/, /\1 /);
    } else {
        /* Removes prefixed '-' that denotes the current term is a suffix */
        //updatedText = updatedText.replace(/([-’'])/, ' ');
    }
    return updatedText;
};

const spaceOutSymbols = (text) => {
    let updatedText = text.replace(/([?.!:;,¿<>(){}[\]])/, / \1 /);
    updatedText = updatedText.replace(/\s+([-'"‘’“”])/, / \1 /);
    updatedText = updatedText.replace(/([-'"‘’“”])\s+/, / \1 /);
    updatedText = updatedText.replace(/([-'"‘’“”])$/, / \1/);
    updatedText = updatedText.replace(/^([-'"‘’“”])/, /\1 /);
    return updatedText;
};

// const normalizedText = normalize('N’ụlọ Akwụkwọà');
// const tokenizedText = tokenize(normalizedText);

// console.log({ normalizedText, tokenizedText });

export {
    clean,
    normalize,
    tokenize,
};