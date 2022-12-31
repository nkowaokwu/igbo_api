import compact from 'lodash/compact';
import WordClass from '../../shared/constants/WordClass';
import removeAccents from '../../shared/utils/removeAccents';
import PartTypes from '../../shared/constants/PartTypes';

/* --- Definitions --- */
/**
 * depth = the current depth level of the backtracking tree
 * isPreviousVerb = if the last node was a verb root
 * isPreviousStativePrefix = if the last node was a stative pref (na-)
 * isNegatorPrefixed = if the last node was a negator prefix (i.e. e)
 * negativePrefix = keeps track of the actual value of the negatorPrefix (used for vowel harmony)
 */

const suffixes = [
  'we',
  'wa',
];

const negativesOrPast = [
  'le',
  'la',
];

// TODO: verify that negative prefix matches with negatives
const negativePrefixes = [
  'a',
  'e',
];

// TODO: check if stative prefix matches
const stativePairs = [
  'a',
  'e',
];

const nots = [
  'ghi',
  'ghị',
];

// TODO: verify that rv matches with preceding vowel
const rv = [
  'ra',
  're',
  'ro',
];

const prefixes = [
  'i',
  'ị',
];

// TODO: verify that imperatives match with root verb
const imperatives = [
  'a',
  'e',
  'o',
  'ọ',
];

// TODO: verify that this is after a root verb and is vowel harmonizing
const multiplePeople = [
  'nu',
  'nụ',
];

// TODO: verify vowel harmony is correct
const stativePrefixes = [
  'na-',
];

const hasNotYet = [
  'be',
];

// TODO: make sure vowel harmonization is correct
const had = [
  'ri',
];

// TODO: make sure that this precedes an a or e
const will = [
  'ga-',
];

// TODO: make sure that this precedes a stative prefix
const shallBe = [
  'ga ',
];

// TODO: make sure that this precedes a stative prefix
const hasBeenAndStill = [
  'ka ',
];

const isRootVerb = (root, wordData) => wordData.verbs.find(({ word: headword, definitions = [] }) => (
  definitions.find(({ wordClass: nestedWordClass }) => (
    nestedWordClass === WordClass.AV.value
    || nestedWordClass === WordClass.MV.value
    || nestedWordClass === WordClass.PV.value
  )))
  && (
    removeAccents.removeExcluding(headword).normalize('NFC') === root
    || definitions.find(({ nsibidi }) => (
      nsibidi === root
    ))
  ),
);
const isSuffix = (root, wordData) => wordData.suffixes.find(({ word: headword, definitions = [] }) => (
  definitions.find(({ wordClass }) => (
    wordClass === WordClass.ESUF.value
    || wordClass === WordClass.ISUF.value
  )))
  && (
    removeAccents.removeExcluding(headword).replace('-', '').normalize('NFC') === root
    || definitions.find(({ nsibidi }) => (
      nsibidi.replace('-', '') === root
    ))
  ),
);

const topSolutions = [];
const helper = (word, wordData, firstPointer, secondPointer, topSolution, meta) => {
  const updatedMeta = { ...meta };
  updatedMeta.depth += 1;
  const solutions = [topSolution];
  while (secondPointer <= word.length) {
    const solution = [...topSolution];
    const currentRange = (word.substring(firstPointer, secondPointer) || '').trim();
    if (!currentRange) {
      secondPointer += 1; // eslint-disable-line
    } else {
      if (prefixes.includes(currentRange)) {
        solution.push({
          type: PartTypes.INFINITIVE,
          text: currentRange,
          wordClass: [WordClass.ISUF.value, WordClass.ESUF.value],
        });
        updatedMeta.isPreviousVerb = false;
        solutions.push(helper(word, wordData, secondPointer, secondPointer + 1, solution, updatedMeta));
      } else if (!updatedMeta.isPreviousVerb && isRootVerb(currentRange, wordData)) {
        solution.push({
          type: PartTypes.VERB_ROOT,
          text: currentRange,
          wordInfo: isRootVerb(currentRange, wordData),
          wordClass: [WordClass.AV.value, WordClass.MV.value, WordClass.PV.value],
        });
        updatedMeta.isPreviousVerb = true;
        solutions.push(helper(word, wordData, secondPointer, secondPointer + 1, solution, updatedMeta));
      } else if (
        !updatedMeta.isPreviousStativePrefix
        && !updatedMeta.isPreviousVerb
        && negativePrefixes.includes(currentRange)
      ) {
        if (negativePrefixes.includes(currentRange)) {
          const forkedUpdatedMeta = { ...updatedMeta };
          solution.push({
            type: PartTypes.NEGATOR_PREFIX,
            text: currentRange,
            wordClass: [WordClass.ISUF.value, WordClass.ESUF.value],
          });
          forkedUpdatedMeta.isPreviousVerb = false;
          forkedUpdatedMeta.isNegatorPrefixed = true;
          forkedUpdatedMeta.negativePrefix = currentRange;
          solutions.push(helper(word, wordData, secondPointer, secondPointer + 1, solution, forkedUpdatedMeta));
        }
      } else if (
        updatedMeta.isPreviousStativePrefix
        && stativePairs.includes(currentRange)
      ) {
        solution.push({
          type: PartTypes.STATIVE_PREFIX_PAIR,
          text: currentRange,
          wordClass: [WordClass.ISUF.value, WordClass.ESUF.value],
        });
        updatedMeta.isPreviousStativePrefix = false;
        solutions.push(helper(word, wordData, secondPointer, secondPointer + 1, solution, updatedMeta));
      } else if (
        negativesOrPast.includes(currentRange)
        && negativePrefixes.includes(currentRange[currentRange.length - 1])
      ) {
        solution.push({
          type: updatedMeta.isNegatorPrefixed ? PartTypes.NEGATOR : PartTypes.QUALIFIER_OR_PAST,
          text: currentRange,
          wordClass: [WordClass.ESUF.value],
        });
        updatedMeta.isPreviousVerb = !updatedMeta.isNegatorPrefixed;
        updatedMeta.negativePrefix = '';
        updatedMeta.isNegatorPrefixed = false;
        solutions.push(helper(word, wordData, secondPointer, secondPointer + 1, solution, updatedMeta));
      } else if (suffixes.includes(currentRange)) {
        solution.push({
          type: PartTypes.STATIVE,
          text: currentRange,
          wordClass: [WordClass.ISUF.value, WordClass.ESUF.value],
        });
        updatedMeta.isPreviousVerb = false;
        solutions.push(helper(word, wordData, secondPointer, secondPointer + 1, solution, updatedMeta));
      } else if (rv.includes(currentRange)) {
        solution.push({
          type: PartTypes.QUALIFIER_OR_PAST,
          text: currentRange,
          wordClass: [WordClass.ISUF.value, WordClass.ESUF.value],
        });
        updatedMeta.isPreviousVerb = false;
        solutions.push(helper(word, wordData, secondPointer, secondPointer + 1, solution, updatedMeta));
      } else if (imperatives.includes(currentRange)) {
        solution.push({
          type: PartTypes.IMPERATIVE,
          text: currentRange,
          wordClass: [WordClass.ISUF.value, WordClass.ESUF.value],
        });
        updatedMeta.isPreviousVerb = true;
        solutions.push(helper(word, wordData, secondPointer, secondPointer + 1, solution, updatedMeta));
      } else if (isSuffix(currentRange, wordData)) {
        solution.push({
          type: PartTypes.EXTENSIONAL_SUFFIX,
          text: currentRange,
          wordInfo: isSuffix(currentRange, wordData),
          wordClass: [WordClass.ISUF.value, WordClass.ESUF.value],
        });
        updatedMeta.isPreviousVerb = true;
        solutions.push(helper(word, wordData, secondPointer, secondPointer + 1, solution, updatedMeta));
      } else if (multiplePeople.includes(currentRange)) {
        // TODO: could be other meaning
        solution.push({
          type: PartTypes.MULTIPLE_PEOPLE,
          text: currentRange,
          wordClass: [WordClass.ISUF.value, WordClass.ESUF.value],
        });
        updatedMeta.isPreviousVerb = false;
        solutions.push(helper(word, wordData, secondPointer, secondPointer + 1, solution, updatedMeta));
      } else if (stativePrefixes.includes(currentRange)) {
        solution.push({
          type: PartTypes.STATIVE_PREFIX,
          text: currentRange,
          wordClass: [WordClass.ISUF.value, WordClass.ESUF.value],
        });
        updatedMeta.isPreviousVerb = false;
        updatedMeta.isPreviousStativePrefix = true;
        solutions.push(helper(word, wordData, secondPointer, secondPointer + 1, solution, updatedMeta));
      } else if (nots.includes(currentRange)) {
        solution.push({
          type: PartTypes.NEGATIVE,
          text: currentRange,
          wordClass: [WordClass.ISUF.value, WordClass.ESUF.value],
        });
        updatedMeta.isPreviousVerb = false;
        solutions.push(helper(word, wordData, secondPointer, secondPointer + 1, solution, updatedMeta));
      } else if (hasNotYet.includes(currentRange)) {
        solution.push({
          type: PartTypes.NEGATIVE_POTENTIAL,
          text: currentRange,
          wordClass: [WordClass.ISUF.value, WordClass.ESUF.value],
        });
        updatedMeta.isPreviousVerb = false;
        solutions.push(helper(word, wordData, secondPointer, secondPointer + 1, solution, updatedMeta));
      } else if (had.includes(currentRange)) {
        solution.push({
          type: PartTypes.PERFECT_PAST,
          text: currentRange,
          wordClass: [WordClass.ISUF.value, WordClass.ESUF.value],
        });
        updatedMeta.isPreviousVerb = false;
        solutions.push(helper(word, wordData, secondPointer, secondPointer + 1, solution, updatedMeta));
      } else if (shallBe.includes(currentRange)) {
        solution.push({
          type: PartTypes.POTENTIAL_CONTINUOUS_PREFIX,
          text: currentRange,
          wordClass: [WordClass.ISUF.value, WordClass.ESUF.value],
        });
        updatedMeta.isPreviousVerb = false;
        solutions.push(helper(word, wordData, secondPointer, secondPointer + 1, solution, updatedMeta));
      } else if (will.includes(currentRange)) {
        solution.push({
          type: PartTypes.FUTURE_CONTINUOUS,
          text: currentRange,
          wordClass: [WordClass.ISUF.value, WordClass.ESUF.value],
        });
        updatedMeta.isPreviousVerb = false;
        solutions.push(helper(word, wordData, secondPointer, secondPointer + 1, solution, updatedMeta));
      } else if (hasBeenAndStill.includes(currentRange)) {
        solution.push({
          type: PartTypes.PAST_PERFECT_CONTINUOUS_PREFIX,
          text: currentRange,
          wordClass: [WordClass.ISUF.value, WordClass.ESUF.value],
        });
        updatedMeta.isPreviousVerb = false;
        solutions.push(helper(word, wordData, secondPointer, secondPointer + 1, solution, updatedMeta));
      }
      secondPointer += 1; // eslint-disable-line
    }
  }
  solutions.forEach((s) => {
    if (s) {
      topSolutions.push({ path: s, metaData: updatedMeta });
    }
  });
};

// Backtracking TODO: tighten rules
export default (rawWord, wordData) => {
  const word = rawWord.toLowerCase().normalize('NFC');
  const firstPointer = 0;
  const secondPointer = 1;
  const allWords = Object.values(wordData).flat();
  const verbs = allWords.filter(({ definitions = [] }) => (
    definitions.find(({ wordClass: nestedWordClass }) => (
      nestedWordClass === WordClass.AV.value
      || nestedWordClass === WordClass.MV.value
      || nestedWordClass === WordClass.PV.value),
    )));
  const wordSuffixes = allWords.filter(({ definitions = [] }) => (
    definitions.find(({ wordClass: nestedWordClass }) => (
      nestedWordClass === WordClass.ESUF.value
      || nestedWordClass === WordClass.ISUF.value),
    )));
  console.log('Expanding word: ', word);
  helper(word, { verbs, suffixes: wordSuffixes }, firstPointer, secondPointer, [], { depth: 0 });
  const { path: solution } = compact(topSolutions).find(({ path, metaData }) => {
    const solutionPathText = removeAccents.removeExcluding(path.reduce((finalString, { text }) => (
      `${finalString}${text}`
    ), '') || '').normalize('NFC');
    // TODO: requiring matching parts to be complete set
    return solutionPathText === word && !metaData.isNegatorPrefixed;
  }) || { path: [] };
  console.log('Expanded verb: ', solution);
  return solution;
};
