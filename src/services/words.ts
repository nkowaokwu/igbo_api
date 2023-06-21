import reduce from 'lodash/reduce';
import keys from 'lodash/keys';
import Word from '../models/interfaces/Word';
import removePrefix from '../shared/utils/removePrefix';
import databaseDictionary from '../dictionaries/ig-en/ig-en_expanded.json';

const doesVariationMatch = (termInformation: Word[], regexWord: RegExp): boolean =>
  reduce(
    termInformation,
    (status: boolean, information: Word) => {
      if (status) {
        return status;
      }
      return (information.variations || []).some((variation) => variation.match(regexWord));
    },
    false
  );

/* Provided a dictionary, find the corresponding terms */
export const resultsFromDictionarySearch = (
  regexWord: RegExp,
  word: string,
  dictionary: Record<string, any>
): Record<string, Word> =>
  keys(dictionary).reduce((matchedResults: Record<string, Word>, key: string) => {
    const currentMatchedResults = { ...matchedResults };
    const termInformation = dictionary[key];
    const trimmedKey = removePrefix(key);
    const isTrimmedKeyAndWordSameLength = trimmedKey.match(regexWord);
    if (isTrimmedKeyAndWordSameLength || doesVariationMatch(termInformation, regexWord)) {
      currentMatchedResults[key] = termInformation;
    }
    return currentMatchedResults;
  }, {});

export const findSearchWord = (regexWord: RegExp, word: string): Record<string, Word> =>
  resultsFromDictionarySearch(regexWord, word, databaseDictionary);
