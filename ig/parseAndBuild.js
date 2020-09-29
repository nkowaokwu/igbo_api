import { last } from 'lodash';
import { getLeftAndTopStyles, getChildrenText } from './utils/parseHelpers';
import writeToFiles from './utils/writeToFiles';
import { clean, normalize } from '../utils/normalization';
import { COLUMN_MAP, SAME_CELL_TOP_DIFFERENCE } from '../shared/constants/parseConstants';

const normalizationMap = {};

let currentWord = '';
let currentPhrase = '';
let prevColumn = null;
let prevSpan = null;
let centerCount = 0;

const resetTrackers = () => {
    currentWord = '';
    currentPhrase = '';
    prevColumn = null;
    centerCount = 0;
}

const insertTermInNormalizationMap = (normalizedTerm, naturalTerm) => {
    if (!normalizationMap[normalizedTerm]) {
        normalizationMap[normalizedTerm] = [];
    }
    normalizationMap[normalizedTerm].push(naturalTerm);
}

const buildDictionary = (span, dictionary, options = {}) => {
    const currentColumn = COLUMN_MAP[getLeftAndTopStyles(span).left];
    const naturalChildrenText = getChildrenText(span);
    const childrenText = options.normalize ? normalize(naturalChildrenText) : naturalChildrenText;

    switch (currentColumn) {
        case 'left':
            const cleanedChildrenText = clean(childrenText);
            const cleanedNaturalChildrenText = clean(naturalChildrenText);
            options.normalize && insertTermInNormalizationMap(cleanedChildrenText, cleanedNaturalChildrenText);
            currentWord = cleanedChildrenText;
            dictionary[currentWord] = dictionary[currentWord] || [];
            dictionary[currentWord].push({
                wordClass: '',
                definition: '',
                examples: [],
                phrases: {}
            });
            centerCount = 0; // Reset the center count for a new word
            currentPhrase = '';
            break;
        case 'center':
            // centerCount keeps track of how many times you are in the center column
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
            break;
        case 'right':
            const isSameCell = getLeftAndTopStyles(span).top - getLeftAndTopStyles(prevSpan).top === SAME_CELL_TOP_DIFFERENCE;
            if (prevColumn === 'center' && centerCount < 2) {
                last(dictionary[currentWord]).definition = childrenText;
            } else if (isSameCell && prevColumn === 'right' && centerCount < 2) {
                const currentDefinition = last(dictionary[currentWord]).definition;
                last(dictionary[currentWord]).definition = currentDefinition + childrenText;
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
            break;
        default:
            break;
        }
        prevSpan = span;
        prevColumn = currentColumn || prevColumn;
}

const buildDictionaries = (root, dictionary, options) => {
    resetTrackers();
    Array.from(root.querySelectorAll('div')).forEach((span) => {
        buildDictionary(span, dictionary, options);
    });
}

writeToFiles({
    buildDictionaries,
    normalizationMap
});