import { last } from 'lodash';
import {
    startsWithLetterDot,
    appendTextToCurrentCell,
    fromRightOrCenterColumn,
    getLeftAndTopStyles,
    getChildrenText,
} from './utils/parseHelpers';
import writeToFiles from './utils/writeToFiles';
import { clean, normalize } from '../utils/normalization';
import { COLUMNS, LEFT_STYLE_TO_COLUMN, SAME_CELL_TOP_DIFFERENCE, CELL_TYPE } from '../shared/constants/parseConstants';

const normalizationMap = {};

let currentWord = '';
let currentPhrase = '';
let prevColumn = null;
let prevSpan = null;
let prevCellType = null;
let centerCount = 0;
let isABPhrase = false;

const resetTrackers = () => {
    currentWord = '';
    currentPhrase = '';
    prevColumn = null;
    centerCount = 0;
}

/* Used to build normalized dictionary json */
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
            prevCellType = CELL_TYPE.WORD;
            break;
        case COLUMNS.CENTER:
            /* centerCount keeps track of how many times you are in the center column
            Great for identifying word classes vs phrases */
            const wordObject = last(dictionary[currentWord]);
            centerCount += 1;
            if (prevColumn === COLUMNS.LEFT) {
                /* Assigns term's word class */
                last(dictionary[currentWord]).wordClass = childrenText;
                prevCellType = CELL_TYPE.WORD_CLASS;
            } else if (prevColumn === COLUMNS.RIGHT || prevColumn === COLUMNS.CENTER) {
                /* Creates new entry for a term's phrase */
                currentPhrase = childrenText;
                if (!!currentPhrase) {
                    wordObject.phrases = {
                        ...wordObject.phrases,
                        [currentPhrase]: { definitions: [], examples: [] },
                    };
                }
                prevCellType = CELL_TYPE.PHRASE;
            }
            isABPhrase = false;
            break;
        case COLUMNS.RIGHT:
            const isSameCell = getLeftAndTopStyles(span).top - getLeftAndTopStyles(prevSpan).top === SAME_CELL_TOP_DIFFERENCE;
            const {
                definitions: currentWordDefinitions,
                examples: currentWordExamples,
             } = last(dictionary[currentWord]);
            const {
                definitions: currentPhraseDefinitions,
                examples: currentPhraseExamples,
             } = last(dictionary[currentWord]).phrases[currentPhrase] || { definitions: [], examples: [] };
            const currentDefinition = last(currentWordDefinitions);
            const lastIndex = currentWordDefinitions.length - 1;
            if (prevColumn === COLUMNS.CENTER) {
                isABPhrase = startsWithLetterDot(childrenText);
            }
            if (prevColumn === COLUMNS.CENTER && centerCount < 2) {
                /* Add a new definition to current term */
                currentWordDefinitions.push(childrenText);
                prevCellType = CELL_TYPE.DEFINITION;
            } else if (isSameCell && prevColumn === COLUMNS.RIGHT && centerCount < 2) {
                /* Append text to the term's last definition */
                currentWordDefinitions[lastIndex] = currentDefinition + childrenText;
            } else if (isABPhrase && fromRightOrCenterColumn(prevColumn) && centerCount < 2) {
                /* Handles definitions that start with a letter then dot for the term's definitions */
                appendTextToCurrentCell(childrenText, currentWordDefinitions);
            } else if (prevColumn === COLUMNS.RIGHT && centerCount < 2) {
                /* Add a new example to current term */
                currentWordExamples.push(childrenText)
            } else if (prevColumn === COLUMNS.CENTER && centerCount >= 2) {
                /* Add phrase definition if current phrase exists */
                !!currentPhrase && currentPhraseDefinitions.push(childrenText);
                prevCellType = CELL_TYPE.DEFINITION;
            } else if (isABPhrase && fromRightOrCenterColumn(prevColumn) && centerCount >= 2) {
                /* Handles definitions that start with a letter then dot
                for the term's current phrase definitions */
                appendTextToCurrentCell(childrenText, currentPhraseDefinitions);
            } else if (isSameCell && prevColumn === COLUMNS.RIGHT && centerCount >= 2) {
                /* Append the text to the current cell depending on type */
                if (prevCellType === CELL_TYPE.DEFINITION) {
                    appendTextToCurrentCell(childrenText, currentPhraseDefinitions);
                } else if (prevCellType === CELL_TYPE.EXAMPLE) {
                    appendTextToCurrentCell(childrenText, currentPhraseExamples);
                }
            } else if (prevColumn === COLUMNS.RIGHT && centerCount >= 2) {
                /* Append the current example to the currentPhrase */
                !!currentPhrase && currentPhraseExamples.push(childrenText);
                prevCellType = CELL_TYPE.EXAMPLE;
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