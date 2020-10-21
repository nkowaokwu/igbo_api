import fs from 'fs';
import { flatten, merge, transform, isEqual, isObject, forIn, forEach } from 'lodash';
import { DICTIONARIES_DIR } from '../shared/constants/parseFileLocations';
import dictionary from './ig-en/ig-en_expanded.json';

/**
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */
function difference(object, base) {
	function changes(object, base) {
		return transform(object, (result, value, key) => {
			if (!isEqual(value, base[key])) {
				result[key] = (isObject(value) && isObject(base[key])) ? changes(value, base[key]) : value;
			}
		});
	}
	return changes(object, base);
}
let count = 0;
const finalDictionary = {};
Object.keys(dictionary).forEach((key) => {
  const words = dictionary[key];
  if (words.length > 1) {
    count += 1;
    // console.log(words);
    const updatedWord = words[0];
    forEach(words, (word, index) => {
      // count += 1;
      if (index !== 0) {
        const diffObject = difference(word, words[index - 1]);
        if (updatedWord.wordClass === 'noun' && !!diffObject.wordClass && updatedWord.wordClass !== diffObject.wordClass) {
          updatedWord.wordClass = diffObject.wordClass;
        }
        if (diffObject?.definitions?.length) {
          updatedWord.definitions.push(diffObject.definitions);
        }
        if (diffObject?.examples?.length) {
          updatedWord.examples.push(diffObject.examples);
        }
        if (diffObject?.variations?.length) {
          updatedWord.variations.push(diffObject.variations);
        }
        if (diffObject?.stems?.length) {
          if (updatedWord.stems === null) {
            updatedWord.stems = [];
          }
          updatedWord.stems.push(diffObject.stems);
        }
      }
    });
    updatedWord.definitions = flatten(updatedWord.definitions);
    updatedWord.examples = flatten(updatedWord.examples);
    updatedWord.variations = flatten(updatedWord.variations);
    updatedWord.stems = flatten(updatedWord.stems);

    // console.log('final word', updatedWord);
    if (!finalDictionary[key]) {
      finalDictionary[key] = [];
    }
    finalDictionary[key].push(updatedWord)
    //console.log(difference(word[0], word[1]));
  } else {
    count += 1;
    if (!finalDictionary[key]) {
      finalDictionary[key] = words;
    }
  }
});

//console.log(finalDictionary);
const dictionaryFilePaths = [
  [`${DICTIONARIES_DIR}/ig-en_expanded.json`, JSON.stringify(finalDictionary, null, 4)],
  [`${DICTIONARIES_DIR}/ig-en.json`, JSON.stringify(finalDictionary)],
];

dictionaryFilePaths.forEach((config) => {
  fs.writeFileSync(...config, () => {
    if (process.env.NODE_ENV !== 'test') {
      console.log(`${config[0]} has been updated`);
    }
  });
});
