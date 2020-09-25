import fs from 'fs';
import { parse } from 'node-html-parser';
import { flatten, last } from 'lodash';
import { clean, normalize } from '../utils/normalization';

const READ_FILE = `${__dirname}/dictionary.html`;
const READ_FILE_FORMAT = 'utf8';

const LEFT_COLUMN = '57.60px';
const CENTER_COULMN = '159.72px';
const RIGHT_COLUMN = '262.02px';

const columnMap = {
    [LEFT_COLUMN]: 'left',
    [CENTER_COULMN]: 'center',
    [RIGHT_COLUMN]: 'right',
};

let currentWord = '';
let currentPhrase = '';
let prevColumn = null;
let centerCount = 0;

const getLeftStyle = (element) => {
    const styles = element.getAttribute('style');
    const leftStyle = styles.split(';')[1];
    return leftStyle.split(':')[1];
}

const getChildrenText = (element) => {
    const children = element.childNodes;
    const childrenText = flatten(children.map((child) => {
        return child.childNodes.map((childNode) => {
            return childNode.rawText;
        });
    }));
    return childrenText.join('');
}

const buildDictionary = (span, dictionary, options = {}) => {
    const currentColumn = columnMap[getLeftStyle(span)];
    const childrenText = options.normalize ? normalize(getChildrenText(span)) : getChildrenText(span);
    switch (currentColumn) {
        case 'left':
            currentWord = clean(childrenText);
            dictionary[currentWord] = dictionary[currentWord] || [];
            dictionary[currentWord].push({
                wordClass: '',
                definition: '',
                examples: [],
                phrases: {}
            });
            centerCount = 0; // Reset the center count for a new word
            currentPhrase = '';
            prevColumn = currentColumn;
            break;
        case 'center':
            // enterCount keeps track of how many times you are in the center column
            // Great for identifying word classes vs phrases
            centerCount += 1;
            if (prevColumn === 'left') {
                // Word class
                last(dictionary[currentWord]).wordClass = childrenText;
            } else if (prevColumn === 'right') {
                currentPhrase = childrenText;
                if (!!currentPhrase) {
                    last(dictionary[currentWord]).phrases = {
                        ...last(dictionary[currentWord]).phrases,
                        [currentPhrase]: { definition: '', examples: [] },
                    };
                }
            }
            prevColumn = currentColumn;
            break;
        case 'right':
            if (prevColumn === 'center' && centerCount < 2) {
                last(dictionary[currentWord]).definition = childrenText;
            } else if (prevColumn === 'right' && centerCount < 2) {
                last(dictionary[currentWord]).examples.push(childrenText)
            } else if (prevColumn === 'center' && centerCount >= 2) {
                // Grab the current phrase and then add to definition
                if (!!currentPhrase) {
                    last(dictionary[currentWord]).phrases[currentPhrase].definition = childrenText;
                }
            } else if (prevColumn === 'right' && centerCount >= 2) {
                // Append the current example to the currentPhrase
                if (!!currentPhrase) {
                    last(dictionary[currentWord]).phrases[currentPhrase].examples.push(childrenText);
                }
            }
            prevColumn = currentColumn;
            break;
        default:
            break;
    }
}

const buildDictionaries = (root, dictionary, options) => {
    resetTrackers();
    Array.from(root.querySelectorAll('div')).forEach((span) => {
        buildDictionary(span, dictionary, options);
    });
}

const resetTrackers = () => {
    currentWord = '';
    currentPhrase = '';
    prevColumn = null;
    centerCount = 0;
}

const dirPath = process.env.NODE_ENV === 'test' ? `${__dirname}/../tests/__mocks__`: __dirname;
const dictionariesDir = `${dirPath}/dictionaries`;
const caseSensitiveDictionary = {};
const caseSensitiveNormalizedDictionary = {};


if (!fs.existsSync(dictionariesDir)){
    fs.mkdirSync(dictionariesDir);
}

fs.readFile(READ_FILE, READ_FILE_FORMAT, (err, data) => {
    if (err) {
        console.log(err);
        return;
    }
    const root = parse(data);

    buildDictionaries(root, caseSensitiveDictionary);
    buildDictionaries(root, caseSensitiveNormalizedDictionary, { normalize: true });

    const writeFileConfigs = [
        [`${dictionariesDir}/ig-en_expanded.json`, JSON.stringify(caseSensitiveDictionary, null, 4)],
        [`${dictionariesDir}/ig-en_normalized_expanded.json`, JSON.stringify(caseSensitiveNormalizedDictionary, null, 4)],
        [`${dictionariesDir}/ig-en_normalized.json`, JSON.stringify(caseSensitiveNormalizedDictionary)],
        [`${dictionariesDir}/ig-en.json`, JSON.stringify(caseSensitiveDictionary)],
    ];

    writeFileConfigs.forEach((config) => {
        fs.writeFile(...config, () => {
            if (err) {
                console.error('An error occurred during writing the dictionary', err);
            }
            console.log(`${config[0]} has been saved`);
        });
    })
});