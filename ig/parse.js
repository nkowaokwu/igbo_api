import fs from 'fs';
import { parse } from 'node-html-parser';
import { flatten } from 'lodash';
import { clean, normalize } from '../utils/normalization';

// TODO: check the case àgìgò

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

const buildDictionary = (span) => {
    const currentColumn = columnMap[getLeftStyle(span)];
        const childrenText = getChildrenText(span);
        switch (currentColumn) {
            case 'left':
                currentWord = childrenText;
                dictionary[currentWord] = {
                    wordClass: '',
                    definition: '',
                    examples: [],
                    phrases: {}
                };
                centerCount = 0; // reset the center count for a new word
                currentPhrase = '';
                // TODO place this in a better spot
                prevColumn = currentColumn;
                break;
            case 'center':
                // centerCount keeps track of how many times you are in the center column
                // great for identifying word classes vs phrases
                centerCount += 1;
                if (prevColumn === 'left') {
                    // word class
                    dictionary[currentWord].wordClass = childrenText;
                } else if (prevColumn === 'right') {
                    // recursive opportunity
                    currentPhrase = childrenText;
                    if (!!currentPhrase) {
                        dictionary[currentWord].phrases = {
                            ...dictionary[currentWord].phrases,
                            [currentPhrase]: { definition: '', examples: [] }, // TODO: move the first element out of example to definition
                        };
                    }
                }
                prevColumn = currentColumn;
                break;
            case 'right':
                if (prevColumn === 'center' && centerCount < 2) {
                    dictionary[currentWord].definition = childrenText;
                } else if (prevColumn === 'right' && centerCount < 2) {
                    dictionary[currentWord].examples.push(childrenText)
                } else if (prevColumn === 'center' && centerCount >= 2) {
                    // grab the current phrase and then add to definition
                    // recursive opportunity
                    if (!!currentPhrase) {
                        dictionary[currentWord].phrases[currentPhrase].definition = childrenText;
                    }
                } else if (prevColumn === 'right' && centerCount >= 2) {
                    // append the current example to the currentPhrase
                    if (!!currentPhrase) {
                        dictionary[currentWord].phrases[currentPhrase].examples.push(childrenText);
                    }
                }
                prevColumn = currentColumn;
                break;
            default:
                //console.log('Invalid option', getLeftStyle(span));
                break;
        }
}

const dictionariesDir = `${__dirname}/dictionaries`;
const dictionary = {};
let currentWord = '';
let currentPhrase = '';
let prevColumn = null;
let centerCount = 0;

if (!fs.existsSync(dictionariesDir)){
    fs.mkdirSync(dictionariesDir);
}

fs.readFile(READ_FILE, READ_FILE_FORMAT, (err, data) => {
    if (err) {
        console.log(err);
        return;
    }
    const root = parse(data);
    Array.from(root.querySelectorAll('div')).forEach((span) => {
        buildDictionary(span);
    })

    
    const writeFileConfigs = [
        [`${dictionariesDir}/ig-en.txt`, JSON.stringify(dictionary)],
        [`${dictionariesDir}/ig-en_compressed.json`, JSON.stringify(dictionary)],
        [`${dictionariesDir}/ig-en_expanded.json`, JSON.stringify(dictionary, null, 4)],
    ];

    writeFileConfigs.forEach((config) => {
        fs.writeFile(...config, (err) => {
            console.log(`${config[0]} has been saved`);
        });
    })
});