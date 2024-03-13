import { compact, isEqual } from 'lodash';
import WordClassEnum from '../../shared/constants/WordClassEnum';
import removeAccents from '../../shared/utils/removeAccents';
import PartTypes from '../../shared/constants/PartTypes';
import { Word } from '../../types';
import { Meta, WordData, Solution, TopSolution, MinimizedWord } from './types';

/* --- Definitions --- */
/**
 * depth = the current depth level of the backtracking tree
 * isPreviousVerb = if the last node was a verb root
 * isPreviousStativePrefix = if the last node was a stative pref (na-)
 * isNegatorPrefixed = if the last node was a negator prefix (i.e. e)
 * negativePrefix = keeps track of the actual value of the negatorPrefix (used for vowel harmony)
 */

const suffixes = ['we', 'wa'];

const negativesOrPast = ['le', 'la'];

// TODO: verify that negative prefix matches with negatives
const negativePrefixes = ['a', 'e'];

// TODO: check if stative prefix matches
const stativePairs = ['a', 'e'];

const nots = ['ghi', 'ghị'];

// TODO: verify that rv matches with preceding vowel
const rv = ['ra', 're', 'ro'];

const prefixes = ['i', 'ị'];

// TODO: verify that imperatives match with root verb
const imperatives = ['a', 'e', 'o', 'ọ'];

// TODO: verify that this is after a root verb and is vowel harmonizing
const multiplePeople = ['nu', 'nụ'];

// TODO: verify vowel harmony is correct
const stativePrefixes = ['na-'];

const hasNotYet = ['be'];

// TODO: make sure vowel harmonization is correct
const had = ['ri'];

// TODO: make sure that this precedes an a or e
const will = ['ga-'];

// TODO: make sure that this precedes a stative prefix
const shallBe = ['ga '];

// TODO: make sure that this precedes a stative prefix
const hasBeenAndStill = ['ka '];

const isRootVerb = (root: string, wordData: WordData): MinimizedWord | undefined =>
  (wordData.verbs || []).find(
    ({ word: headword, definitions = [] }) =>
      definitions.find(
        ({ wordClass: nestedWordClassEnum }) =>
          nestedWordClassEnum === WordClassEnum.AV || nestedWordClassEnum === WordClassEnum.PV
      ) &&
      (removeAccents.removeExcluding(headword).normalize('NFC') === root ||
        definitions.find(({ nsibidi }) => nsibidi === root))
  );

const isSuffix = (root: string, wordData: WordData): MinimizedWord | undefined =>
  (wordData.suffixes || []).find(
    ({ word: headword, definitions = [] }) =>
      definitions.find(({ wordClass }) => wordClass === WordClassEnum.ESUF || wordClass === WordClassEnum.ISUF) &&
      (removeAccents.removeExcluding(headword).replace('-', '').normalize('NFC') === root ||
        definitions.find(({ nsibidi }) => nsibidi && nsibidi.replace('-', '') === root))
  );

const topSolutions: TopSolution[] = [];

const helper = (
  word: string,
  wordData: WordData,
  firstPointer: number,
  secondPointer: number,
  topSolution: Solution[],
  meta: Meta
): Solution[] => {
  let localSecondPoint = secondPointer;
  const updatedMeta = { ...meta };
  updatedMeta.depth += 1;
  const solutions = topSolution;
  while (localSecondPoint <= word.length) {
    const solution = [...topSolution];
    const currentRange = (word.substring(firstPointer, localSecondPoint) || '').trim();
    if (!currentRange) {
      localSecondPoint += 1;
    } else {
      if (prefixes.includes(currentRange)) {
        solution.push({
          type: PartTypes.INFINITIVE,
          text: currentRange,
          wordClass: [WordClassEnum.ISUF, WordClassEnum.ESUF],
        });
        updatedMeta.isPreviousVerb = false;
        solutions.push(...helper(word, wordData, localSecondPoint, localSecondPoint + 1, solution, updatedMeta));
      } else if (!updatedMeta.isPreviousVerb && isRootVerb(currentRange, wordData)) {
        solution.push({
          type: PartTypes.VERB_ROOT,
          text: currentRange,
          wordInfo: isRootVerb(currentRange, wordData),
          wordClass: [WordClassEnum.AV, WordClassEnum.PV],
        });
        updatedMeta.isPreviousVerb = true;
        solutions.push(...helper(word, wordData, localSecondPoint, localSecondPoint + 1, solution, updatedMeta));
      } else if (
        !updatedMeta.isPreviousStativePrefix &&
        !updatedMeta.isPreviousVerb &&
        negativePrefixes.includes(currentRange)
      ) {
        if (negativePrefixes.includes(currentRange)) {
          const forkedUpdatedMeta = { ...updatedMeta };
          // Skipping to avoid matching with individual letters
          // solution.push({
          //   type: PartTypes.NEGATOR_PREFIX,
          //   text: currentRange,
          //   wordClass: [WordClassEnum.ISUF, WordClassEnum.ESUF],
          // });
          // forkedUpdatedMeta.isPreviousVerb = false;
          // forkedUpdatedMeta.isNegatorPrefixed = true;
          // forkedUpdatedMeta.negativePrefix = currentRange;
          solutions.push(
            ...helper(word, wordData, localSecondPoint, localSecondPoint + 1, solution, forkedUpdatedMeta)
          );
        }
      } else if (updatedMeta.isPreviousStativePrefix && stativePairs.includes(currentRange)) {
        solution.push({
          type: PartTypes.STATIVE_PREFIX_PAIR,
          text: currentRange,
          wordClass: [WordClassEnum.ISUF, WordClassEnum.ESUF],
        });
        updatedMeta.isPreviousStativePrefix = false;
        solutions.push(...helper(word, wordData, localSecondPoint, localSecondPoint + 1, solution, updatedMeta));
      } else if (
        negativesOrPast.includes(currentRange) &&
        negativePrefixes.includes(currentRange[currentRange.length - 1])
      ) {
        solution.push({
          type: updatedMeta.isNegatorPrefixed ? PartTypes.NEGATOR : PartTypes.QUALIFIER_OR_PAST,
          text: currentRange,
          wordClass: [WordClassEnum.ESUF],
        });
        updatedMeta.isPreviousVerb = !updatedMeta.isNegatorPrefixed;
        updatedMeta.negativePrefix = '';
        updatedMeta.isNegatorPrefixed = false;
        solutions.push(...helper(word, wordData, localSecondPoint, localSecondPoint + 1, solution, updatedMeta));
      } else if (suffixes.includes(currentRange)) {
        solution.push({
          type: PartTypes.STATIVE,
          text: currentRange,
          wordClass: [WordClassEnum.ISUF, WordClassEnum.ESUF],
        });
        updatedMeta.isPreviousVerb = false;
        solutions.push(...helper(word, wordData, localSecondPoint, localSecondPoint + 1, solution, updatedMeta));
      } else if (rv.includes(currentRange)) {
        solution.push({
          type: PartTypes.QUALIFIER_OR_PAST,
          text: currentRange,
          wordClass: [WordClassEnum.ISUF, WordClassEnum.ESUF],
        });
        updatedMeta.isPreviousVerb = false;
        solutions.push(...helper(word, wordData, localSecondPoint, localSecondPoint + 1, solution, updatedMeta));
      } else if (imperatives.includes(currentRange)) {
        solution.push({
          type: PartTypes.IMPERATIVE,
          text: currentRange,
          wordClass: [WordClassEnum.ISUF, WordClassEnum.ESUF],
        });
        updatedMeta.isPreviousVerb = true;
        solutions.push(...helper(word, wordData, localSecondPoint, localSecondPoint + 1, solution, updatedMeta));
      } else if (isSuffix(currentRange, wordData)) {
        solution.push({
          type: PartTypes.EXTENSIONAL_SUFFIX,
          text: currentRange,
          wordInfo: isSuffix(currentRange, wordData),
          wordClass: [WordClassEnum.ISUF, WordClassEnum.ESUF],
        });
        updatedMeta.isPreviousVerb = true;
        solutions.push(...helper(word, wordData, localSecondPoint, localSecondPoint + 1, solution, updatedMeta));
      } else if (multiplePeople.includes(currentRange)) {
        // TODO: could be other meaning
        solution.push({
          type: PartTypes.MULTIPLE_PEOPLE,
          text: currentRange,
          wordClass: [WordClassEnum.ISUF, WordClassEnum.ESUF],
        });
        updatedMeta.isPreviousVerb = false;
        solutions.push(...helper(word, wordData, localSecondPoint, localSecondPoint + 1, solution, updatedMeta));
      } else if (stativePrefixes.includes(currentRange)) {
        solution.push({
          type: PartTypes.STATIVE_PREFIX,
          text: currentRange,
          wordClass: [WordClassEnum.ISUF, WordClassEnum.ESUF],
        });
        updatedMeta.isPreviousVerb = false;
        updatedMeta.isPreviousStativePrefix = true;
        solutions.push(...helper(word, wordData, localSecondPoint, localSecondPoint + 1, solution, updatedMeta));
      } else if (nots.includes(currentRange)) {
        solution.push({
          type: PartTypes.NEGATIVE,
          text: currentRange,
          wordClass: [WordClassEnum.ISUF, WordClassEnum.ESUF],
        });
        updatedMeta.isPreviousVerb = false;
        solutions.push(...helper(word, wordData, localSecondPoint, localSecondPoint + 1, solution, updatedMeta));
      } else if (hasNotYet.includes(currentRange)) {
        solution.push({
          type: PartTypes.NEGATIVE_POTENTIAL,
          text: currentRange,
          wordClass: [WordClassEnum.ISUF, WordClassEnum.ESUF],
        });
        updatedMeta.isPreviousVerb = false;
        solutions.push(...helper(word, wordData, localSecondPoint, localSecondPoint + 1, solution, updatedMeta));
      } else if (had.includes(currentRange)) {
        solution.push({
          type: PartTypes.PERFECT_PAST,
          text: currentRange,
          wordClass: [WordClassEnum.ISUF, WordClassEnum.ESUF],
        });
        updatedMeta.isPreviousVerb = false;
        solutions.push(...helper(word, wordData, localSecondPoint, localSecondPoint + 1, solution, updatedMeta));
      } else if (shallBe.includes(currentRange)) {
        solution.push({
          type: PartTypes.POTENTIAL_CONTINUOUS_PREFIX,
          text: currentRange,
          wordClass: [WordClassEnum.ISUF, WordClassEnum.ESUF],
        });
        updatedMeta.isPreviousVerb = false;
        solutions.push(...helper(word, wordData, localSecondPoint, localSecondPoint + 1, solution, updatedMeta));
      } else if (will.includes(currentRange)) {
        solution.push({
          type: PartTypes.FUTURE_CONTINUOUS,
          text: currentRange,
          wordClass: [WordClassEnum.ISUF, WordClassEnum.ESUF],
        });
        updatedMeta.isPreviousVerb = false;
        solutions.push(...helper(word, wordData, localSecondPoint, localSecondPoint + 1, solution, updatedMeta));
      } else if (hasBeenAndStill.includes(currentRange)) {
        solution.push({
          type: PartTypes.PAST_PERFECT_CONTINUOUS_PREFIX,
          text: currentRange,
          wordClass: [WordClassEnum.ISUF, WordClassEnum.ESUF],
        });
        updatedMeta.isPreviousVerb = false;
        solutions.push(...helper(word, wordData, localSecondPoint, localSecondPoint + 1, solution, updatedMeta));
      }
      localSecondPoint += 1;
    }
  }
  solutions.forEach((s) => {
    if (s && !topSolutions.find(({ solution: currentSolution }) => isEqual(s, currentSolution))) {
      topSolutions.push({ solution: s, metaData: updatedMeta });
    }
  });
  return solutions || [];
};

// Backtracking TODO: tighten rules
export default (rawWord: string, wordData: WordData): Solution[] => {
  const word = rawWord.toLowerCase().normalize('NFC');
  const firstPointer = 0;
  const secondPointer = 1;
  const allWords = Object.values(wordData).flat();
  const verbs = allWords.filter(({ definitions = [] }) =>
    definitions.find(
      ({ wordClass: nestedWordClassEnum }) =>
        nestedWordClassEnum === WordClassEnum.AV || nestedWordClassEnum === WordClassEnum.PV
    )
  );
  const wordSuffixes = allWords.filter(({ definitions = [] }) =>
    definitions.find(
      ({ wordClass: nestedWordClassEnum }) =>
        nestedWordClassEnum === WordClassEnum.ESUF || nestedWordClassEnum === WordClassEnum.ISUF
    )
  );
  helper(word, { verbs, suffixes: wordSuffixes }, firstPointer, secondPointer, [], { depth: 0 });
  const finalSolution =
    compact(
      topSolutions.map(({ solution, metaData }) => {
        const cleanedText = removeAccents
          .removeExcluding([...solution.text].reduce((finalString, letter) => `${finalString}${letter}`, '') || '')
          .normalize('NFC');

        // TODO: requiring matching parts to be complete set
        if (cleanedText === word && !metaData.isNegatorPrefixed) {
          console.log('Cleaned text and word matched and does not have a negator prefix');
        }
        return solution;
      })
    ) || [];
  return finalSolution;
};
