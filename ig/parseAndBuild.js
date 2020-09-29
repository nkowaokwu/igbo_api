import { last } from 'lodash';
import { getLeftAndTopStyles, getChildrenText } from './utils/parseHelpers';
import writeToFiles from './utils/writeToFiles';
import { clean, normalize } from '../utils/normalization';
import { COLUMNS, LEFT_STYLE_TO_COLUMN, SAME_CELL_TOP_DIFFERENCE } from '../shared/constants/parseConstants';

const normalizationMap = {};

let currentWord = '';
let currentPhrase = '';
let prevColumn = null;
let prevSpan = null;
let centerCount = 0;
let isABPhrase = false;

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
    const currentColumn = LEFT_STYLE_TO_COLUMN[getLeftAndTopStyles(span).left];
    const naturalChildrenText = getChildrenText(span);
    const childrenText = options.normalize ? normalize(naturalChildrenText) : naturalChildrenText;

    switch (currentColumn) {
        case COLUMNS.LEFT:
            const cleanedChildrenText = clean(childrenText);
            const cleanedNaturalChildrenText = clean(naturalChildrenText);
            options.normalize && insertTermInNormalizationMap(cleanedChildrenText, cleanedNaturalChildrenText);
            currentWord = cleanedChildrenText;
            dictionary[currentWord] = dictionary[currentWord] || [];
            dictionary[currentWord].push({
                wordClass: '',
                definitions: [],
                examples: [],
                phrases: {}
            });
            centerCount = 0; // Reset the center count for a new word
            currentPhrase = '';
            isABPhrase = false;
            break;
        case COLUMNS.CENTER:
            // centerCount keeps track of how many times you are in the center column
            // Great for identifying word classes vs phrases
            centerCount += 1;
            if (prevColumn === COLUMNS.LEFT) {
                // Word class
                last(dictionary[currentWord]).wordClass = childrenText;
            } else if (prevColumn === COLUMNS.RIGHT || prevColumn === COLUMNS.CENTER) {
                currentPhrase = childrenText;
                if (!!currentPhrase) {
                    last(dictionary[currentWord]).phrases = {
                        ...last(dictionary[currentWord]).phrases,
                        [currentPhrase]: { definitions: [], examples: [] },
                    };
                }
            }
            isABPhrase = false;
            break;
        case COLUMNS.RIGHT:
            const isSameCell = getLeftAndTopStyles(span).top - getLeftAndTopStyles(prevSpan).top === SAME_CELL_TOP_DIFFERENCE;
            if (prevColumn === COLUMNS.CENTER) {
                isABPhrase = childrenText.startsWith('A. ') || childrenText.startsWith('B. ') || childrenText.startsWith('C. ') || childrenText.startsWith('D. ');
            }
            if (prevColumn === COLUMNS.CENTER && centerCount < 2) {
                last(dictionary[currentWord]).definitions.push(childrenText);
            } else if (isSameCell && prevColumn === COLUMNS.RIGHT && centerCount < 2) {
                const currentDefinition = last(last(dictionary[currentWord]).definitions);
                const lastIndex = last(dictionary[currentWord]).definitions.length - 1;
                last(dictionary[currentWord]).definitions[lastIndex] = currentDefinition + childrenText;
            } else if (isABPhrase && (prevColumn === COLUMNS.RIGHT || prevColumn === COLUMNS.CENTER) && centerCount < 2) {
                const isABBeginning = childrenText.startsWith('A. ') || childrenText.startsWith('B. ') || childrenText.startsWith('C. ') || childrenText.startsWith('D. ');
                console.log(isABBeginning, childrenText);
                if (isABBeginning) {
                    last(dictionary[currentWord]).definitions.push(childrenText);
                } else {
                    const currentDefinition = last(last(dictionary[currentWord]).definitions);
                    const lastIndex = last(dictionary[currentWord]).definitions.length - 1;
                    last(dictionary[currentWord]).definitions[lastIndex] = currentDefinition + childrenText;
                }
            } else if (prevColumn === COLUMNS.RIGHT && centerCount < 2) {
                last(dictionary[currentWord]).examples.push(childrenText)
            } else if (prevColumn === COLUMNS.CENTER && centerCount >= 2) {
                // Grab the current phrase and then add to definition
                if (!!currentPhrase) {
                    last(dictionary[currentWord]).phrases[currentPhrase].definitions.push(childrenText);
                }
            } else if (isABPhrase && (prevColumn === COLUMNS.RIGHT || prevColumn === COLUMNS.CENTER) && centerCount >= 2) {
                const isABBeginning = childrenText.startsWith('A. ') || childrenText.startsWith('B. ') || childrenText.startsWith('C. ') || childrenText.startsWith('D. ');
                if (isABBeginning) {
                    last(dictionary[currentWord]).phrases[currentPhrase].definitions.push(childrenText)
                } else {
                    const currentDefinition = last(last(dictionary[currentWord]).phrases[currentPhrase].definitions);
                    const lastIndex = last(dictionary[currentWord]).phrases[currentPhrase].definitions.length - 1;
                    last(dictionary[currentWord]).phrases[currentPhrase].definitions[lastIndex] = currentDefinition + childrenText;
                }
            } else if (prevColumn === COLUMNS.RIGHT && centerCount >= 2) {
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