/* eslint-disable no-case-declarations */
/* eslint-disable no-param-reassign */
import {
  last,
  drop,
  first,
  map,
  trimStart,
  compact,
} from 'lodash';
import {
  startsWithLetterDot,
  appendTextToCurrentCell,
  getLeftAndTopStyles,
  getChildrenText,
} from './utils/parseHelpers';
import writeToFiles from './utils/writeToFiles';
import replaceAbbreviations from '../shared/utils/replaceAbbreviations';
import { clean } from '../shared/utils/normalization';
import {
  COLUMNS,
  LEFT_STYLE_TO_COLUMN,
  SAME_CELL_TOP_DIFFERENCE,
  CELL_TYPE,
} from '../shared/constants/parseConstants';

let currentWord = '';
let currentPhrase = null;
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
};

/* Helper function to insert the current phrase in the provided word object */
const insertCurrentPhrase = ({ phrase, currentPhraseData, wordObject }) => {
  if (phrase) {
    wordObject.phrases = {
      ...wordObject.phrases,
      [phrase]: currentPhraseData,
    };
  }
};

const isPrevCellEitherSameCellExampleOrDefinition = ({
  currentPhrase: phrase,
  isSameCell,
  prevCellType: prevCell,
}) => (
  phrase && isSameCell && (prevCell === CELL_TYPE.DEFINITION || prevCell === CELL_TYPE.EXAMPLE)
);
const isWordSameCellDefinition = ({
  currentPhrase: phrase,
  isSameCell,
  isABPhrase: abPhrase,
  prevColumn: prevCol,
  prevCellType: prevCell,
}) => (
  !phrase && !abPhrase && isSameCell && prevCol === COLUMNS.RIGHT && prevCell === CELL_TYPE.DEFINITION
);

const isPrevCellEitherExampleOrDefinitionAndNotSameCell = ({
  currentPhrase: phrase,
  isSameCell,
  prevCellType: prevCell,
}) => (
  phrase && !isSameCell && (prevCell === CELL_TYPE.EXAMPLE || prevCell === CELL_TYPE.DEFINITION)
);

const isUnderSameCellPixelThreshold = ({ span, prevSpan: previousSpan }) => (
  getLeftAndTopStyles(span).top - getLeftAndTopStyles(previousSpan).top <= SAME_CELL_TOP_DIFFERENCE
);

const buildDictionary = (span, dictionary) => {
  const currentColumn = LEFT_STYLE_TO_COLUMN[getLeftAndTopStyles(span).left];
  const naturalChildrenText = getChildrenText(span);
  const childrenText = replaceAbbreviations(naturalChildrenText);
  const cleanedChildrenText = clean(childrenText);
  const wordObject = last(dictionary[currentWord]);
  let isSameCell;
  let isSameRow;

  switch (currentColumn) {
    case COLUMNS.LEFT:
      const separateVariations = cleanedChildrenText.split(',');
      const newWordData = {
        wordClass: '',
        definitions: [],
        examples: [],
        phrases: {},
        variations: [],
      };

      /* Parses out the multiple terms separated by commas */
      if (separateVariations.length > 1) {
        isSameCell = getLeftAndTopStyles(span).top - getLeftAndTopStyles(prevSpan).top <= SAME_CELL_TOP_DIFFERENCE;
        if (!isSameCell) {
          /* If the term is not in the same cell, that means that it's one of the first terms */
          const primaryTerm = first(separateVariations);
          newWordData.variations = compact(map(drop(separateVariations), (variation) => trimStart(variation)));
          currentWord = primaryTerm;
          dictionary[currentWord] = dictionary[currentWord] || [];
          dictionary[currentWord].push(newWordData);
        } else {
          /* If in the same cell, use the current terms as variations for the primary term */
          newWordData.variations = [
            ...newWordData.variations,
            ...map(separateVariations, (variation) => trimStart(variation)),
          ];
          const lastIndex = dictionary[currentWord].length - 1;
          const lastWordObject = last(dictionary[currentWord]);
          dictionary[currentWord][lastIndex].variations = compact([
            ...lastWordObject.variations,
            ...newWordData.variations,
          ]);
        }
      } else {
        currentWord = cleanedChildrenText;
        dictionary[currentWord] = dictionary[currentWord] || [];
        dictionary[currentWord].push(newWordData);
      }

      centerCount = 0; // Reset the center count for a new word
      currentPhrase = null;
      isABPhrase = false;
      prevCellType = CELL_TYPE.WORD;
      break;
    case COLUMNS.CENTER:
      isSameCell = isUnderSameCellPixelThreshold({ span, prevSpan }) && prevColumn === currentColumn;
      isSameRow = getLeftAndTopStyles(span).top === getLeftAndTopStyles(prevSpan).top;
      /* centerCount keeps track of how many times you are in the center column
            Great for identifying word classes vs phrases */
      centerCount += 1;
      if (prevCellType === CELL_TYPE.PHRASE) {
        /* If the last phrase was empty, append it to the last populated phrase */
        const wordObjectPhrases = Object.keys(wordObject.phrases);
        const lastPopulatedPhrase = wordObjectPhrases[wordObjectPhrases.length - 2];
        const lastUnpopulatedPhrase = last(wordObjectPhrases);
        const populatedPhraseData = wordObject.phrases[lastPopulatedPhrase];

        currentPhrase = `${lastPopulatedPhrase} ${lastUnpopulatedPhrase}`;
        delete wordObject.phrases[lastUnpopulatedPhrase];
        delete wordObject.phrases[lastPopulatedPhrase];

        insertCurrentPhrase({ phrase: currentPhrase, currentPhraseData: populatedPhraseData, wordObject });
      }
      if (prevColumn === COLUMNS.LEFT) {
        /* Assigns term's word class */
        last(dictionary[currentWord]).wordClass = childrenText;
        prevCellType = CELL_TYPE.WORD_CLASS;
      } else if (!isSameCell && (prevColumn === COLUMNS.RIGHT || prevColumn === COLUMNS.CENTER)) {
        /* Creates new entry for a term's phrase */
        currentPhrase = childrenText;
        insertCurrentPhrase({
          phrase: currentPhrase,
          currentPhraseData: { definitions: [], examples: [] },
          wordObject,
        });
        prevCellType = CELL_TYPE.PHRASE;
      } else if (isSameCell) {
        /* If the phrase is in the same cell as the last, then append to the last phrase */
        const lastPhrase = last(Object.keys(wordObject.phrases));
        const lastPhraseData = wordObject.phrases[lastPhrase];
        delete wordObject.phrases[lastPhrase];
        currentPhrase = `${lastPhrase} ${childrenText}`;
        insertCurrentPhrase({ phrase: currentPhrase, currentPhraseData: lastPhraseData, wordObject });
      }
      isABPhrase = false;
      break;
    case COLUMNS.RIGHT:
      isSameCell = isUnderSameCellPixelThreshold({ span, prevSpan }) && prevColumn === currentColumn;
      isSameRow = getLeftAndTopStyles(span).top === getLeftAndTopStyles(prevSpan).top;

      const { definitions: currentWordDefinitions, examples: currentWordExamples } = last(dictionary[currentWord]);
      const { definitions: currentPhraseDefinitions, examples: currentPhraseExamples } = last(dictionary[currentWord])
        .phrases[currentPhrase] || { definitions: [], examples: [] };
      const currentDefinition = last(currentWordDefinitions);
      const lastIndex = currentWordDefinitions.length - 1;

      if (prevColumn === COLUMNS.CENTER) {
        isABPhrase = startsWithLetterDot(childrenText);
      }

      if (prevColumn === COLUMNS.CENTER && (prevCellType === CELL_TYPE.WORD_CLASS || prevCellType === CELL_TYPE.WORD)) {
        /* Add a new definition to current term */
        currentWordDefinitions.push(childrenText);
        prevCellType = CELL_TYPE.DEFINITION;
      } else if (isWordSameCellDefinition({
        currentPhrase,
        isSameCell,
        isABPhrase,
        prevColumn,
        prevCellType,
      })) {
        /* Append to the term's last definition */
        currentWordDefinitions[lastIndex] = `${currentDefinition} ${childrenText}`;
        prevCellType = CELL_TYPE.DEFINITION;
      } else if (!currentPhrase && isABPhrase && !isSameCell) {
        /* If the childrenText starts with a letter then dot, it's a new word definition */
        currentWordDefinitions.push(childrenText);
        prevCellType = CELL_TYPE.DEFINITION;
      } else if (!currentPhrase && isABPhrase && isSameCell) {
        /* Handles definitions that start with a letter then dot for the term's definitions */
        appendTextToCurrentCell(childrenText, currentWordDefinitions);
        prevCellType = CELL_TYPE.DEFINITION;
      } else if (prevColumn === COLUMNS.RIGHT && centerCount < 2 && centerCount !== 0) {
        /* Add a new example to current term */
        currentWordExamples.push(childrenText);
        prevCellType = CELL_TYPE.EXAMPLE;
      } else if (currentPhrase && isSameRow && prevCellType === CELL_TYPE.PHRASE) {
        /* Add phrase definition if current phrase exists */
        currentPhraseDefinitions.push(childrenText);
        prevCellType = CELL_TYPE.DEFINITION;
      } else if (currentPhrase && !isSameRow && prevCellType === CELL_TYPE.PHRASE) {
        currentPhraseExamples.push(childrenText);
        prevCellType = CELL_TYPE.EXAMPLE;
      } else if (currentPhrase && isABPhrase && isSameCell) {
        /* Handles definitions that start with a letter then dot
                for the term's current phrase definitions */
        appendTextToCurrentCell(childrenText, currentPhraseDefinitions);
        prevCellType = CELL_TYPE.DEFINITION;
      } else if (currentPhrase && isABPhrase && !isSameCell) {
        if (!startsWithLetterDot(childrenText)) {
          /* In between A. B. definitions, there are examples, they should be inserted in the examples section */
          currentPhraseExamples.push(childrenText);
          prevCellType = CELL_TYPE.EXAMPLE;
        } else {
          currentPhraseDefinitions.push(childrenText);
          prevCellType = CELL_TYPE.DEFINITION;
        }
      } else if (!currentPhrase && isSameCell && prevCellType === CELL_TYPE.EXAMPLE) {
        appendTextToCurrentCell(childrenText, currentWordExamples);
        prevCellType = CELL_TYPE.EXAMPLE;
      } else if (isPrevCellEitherSameCellExampleOrDefinition({ currentPhrase, isSameCell, prevCellType })) {
        /* Append the to the current cell depending on type */
        if (prevCellType === CELL_TYPE.DEFINITION) {
          appendTextToCurrentCell(childrenText, currentPhraseDefinitions);
          prevCellType = CELL_TYPE.DEFINITION;
        } else if (prevCellType === CELL_TYPE.EXAMPLE) {
          appendTextToCurrentCell(childrenText, currentPhraseExamples);
          prevCellType = CELL_TYPE.EXAMPLE;
        }
      } else if (isPrevCellEitherExampleOrDefinitionAndNotSameCell({ currentPhrase, isSameCell, prevCellType })) {
        /* Append the current example to the currentPhrase */
        currentPhraseExamples.push(childrenText);
        prevCellType = CELL_TYPE.EXAMPLE;
      } else if (isSameRow && prevCellType === CELL_TYPE.WORD) {
        /* If on the same row as the last cell which was a word, then the current childrenText is a word definition */
        currentWordDefinitions.push(childrenText);
        prevCellType = CELL_TYPE.DEFINITION;
      } else if (!isSameRow && (prevCellType === CELL_TYPE.WORD || prevCellType === CELL_TYPE.WORD_CLASS)) {
        /* If not on the same row as the last cel that was either a word or word class, then the current
                childrenText is a word example */
        currentWordExamples.push(childrenText);
        prevCellType = CELL_TYPE.EXAMPLE;
      }
      break;
    default:
      break;
  }
  prevSpan = span;
  prevColumn = currentColumn || prevColumn;
};

const buildDictionaries = (root, dictionary, options) => {
  resetTrackers();
  Array.from(root.querySelectorAll('div')).forEach((span) => {
    buildDictionary(span, dictionary, options);
  });
};

writeToFiles({
  buildDictionaries,
});
