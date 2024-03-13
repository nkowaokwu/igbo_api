import { compact, isEqual } from 'lodash';
import WordClassEnum from '../../shared/constants/WordClassEnum';
import removeAccents from '../../shared/utils/removeAccents';
import PartTypes from '../../shared/constants/PartTypes';
import { Meta, WordData, Solution, TopSolution, MinimizedWord } from './types';

const nominalPrefixes = ['a', 'e', 'i', 'ị', 'o', 'ọ', 'u', 'ụ', 'n', 'nn', 'm', 'mm'];

const isRootVerb = (root: string, wordData: WordData): MinimizedWord | undefined =>
  (wordData.verbs || []).find(
    ({ word: headword, definitions = [] }) =>
      definitions.find(
        ({ wordClass: nestedWordClass }) => nestedWordClass === WordClassEnum.AV || nestedWordClass === WordClassEnum.PV
      ) &&
      (removeAccents.removeExcluding(headword).normalize('NFC') === root ||
        definitions.find(({ nsibidi }) => nsibidi === root))
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
      localSecondPoint += 1; // eslint-disable-line
    } else {
      if (updatedMeta.nominalPrefix && isRootVerb(currentRange, wordData)) {
        solution.push({
          type: PartTypes.VERB_ROOT,
          text: currentRange,
          wordInfo: isRootVerb(currentRange, wordData),
          wordClass: [WordClassEnum.AV, WordClassEnum.PV],
        });
        updatedMeta.isPreviousVerb = true;
        solutions.push(...helper(word, wordData, localSecondPoint, localSecondPoint + 1, solution, updatedMeta));
      } else if (!updatedMeta.nominalPrefix && nominalPrefixes.includes(currentRange)) {
        solution.push({
          type: PartTypes.NOMINAL_PREFIX,
          text: currentRange,
          wordClass: [WordClassEnum.ISUF, WordClassEnum.ESUF],
        });
        updatedMeta.isPreviousVerb = false;
        updatedMeta.negatorPrefixed = false;
        updatedMeta.nominalPrefix = true;
        solutions.push(...helper(word, wordData, localSecondPoint, localSecondPoint + 1, solution, { ...updatedMeta }));
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

// Backtracking
export default (rawWord: string, wordData: WordData): Solution[] => {
  const word = rawWord.toLowerCase().normalize('NFC');
  const firstPointer = 0;
  const secondPointer = 1;
  const allWords = Object.values(wordData).flat();
  const verbs = allWords.filter(({ definitions = [] }) =>
    definitions.find(
      ({ wordClass: nestedWordClass }) => nestedWordClass === WordClassEnum.AV || nestedWordClass === WordClassEnum.PV
    )
  );
  helper(word, { verbs }, firstPointer, secondPointer, [], { depth: 0 });
  const finalSolution =
    compact(
      topSolutions.map(({ solution }) => {
        const cleanedText = removeAccents
          .removeExcluding([...solution.text].reduce((finalString, letter) => `${finalString}${letter}`, '') || '')
          .normalize('NFC');
        if (cleanedText === word) {
          console.warn('Cleaned text and word are equal');
        }
        return solution;
      })
    ) || [];
  return finalSolution;
};
