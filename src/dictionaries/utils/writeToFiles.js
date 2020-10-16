import fs from 'fs';
import { flatten } from 'lodash';
import { parse } from 'node-html-parser';
import {
  READ_FILE,
  READ_FILE_FORMAT,
  DICTIONARIES_DIR,
  BUILD_DICTIONARIES_DIR,
} from '../../shared/constants/parseFileLocations';

export default ({ buildDictionaries }) => {
  const caseSensitiveDictionary = {};

  if (!fs.existsSync(DICTIONARIES_DIR)) {
    fs.mkdirSync(DICTIONARIES_DIR);
  }

  if (process.env.NODE_ENV !== 'test' && !fs.existsSync(BUILD_DICTIONARIES_DIR)) {
    fs.mkdirSync(BUILD_DICTIONARIES_DIR);
  }

  fs.readFile(READ_FILE, READ_FILE_FORMAT, (err, data) => {
    if (err) {
      throw new Error('Unable to read file', err);
    }
    const root = parse(data);

    buildDictionaries(root, caseSensitiveDictionary);

    const dictionaryFilePaths = [
      [`${DICTIONARIES_DIR}/ig-en_expanded.json`, JSON.stringify(caseSensitiveDictionary, null, 4)],
      [`${DICTIONARIES_DIR}/ig-en.json`, JSON.stringify(caseSensitiveDictionary)],
    ];

    const buildDictionaryFilePaths = process.env.NODE_ENV === 'build'
      ? [
        [`${BUILD_DICTIONARIES_DIR}/ig-en_expanded.json`, JSON.stringify(caseSensitiveDictionary, null, 4)],
        [`${BUILD_DICTIONARIES_DIR}/ig-en.json`, JSON.stringify(caseSensitiveDictionary)],
      ] : [];

    flatten([dictionaryFilePaths, buildDictionaryFilePaths]).forEach((config) => {
      fs.writeFileSync(...config, () => {
        if (err) {
          throw new Error('An error occurred during writing the dictionary');
        }
        if (process.env.NODE_ENV !== 'test') {
          console.log(`${config[0]} has been saved`);
        }
      });
    });
  });
};
