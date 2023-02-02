import compact from 'lodash/compact';
import WordClass from '../../shared/constants/WordClass';
import removeAccents from '../../shared/utils/removeAccents';
import PartTypes from '../../shared/constants/PartTypes';

const nominalPrefixes = [
  'a',
  'e',
  'i',
  'ị',
  'o',
  'ọ',
  'u',
  'ụ',
  'n',
  'nn',
  'm',
  'mm',
];

const isRootVerb = (root, wordData) => wordData.verbs.find(({ word: headword, definitions = [] }) => (
  definitions.find(({ wordClass: nestedWordClass }) => (
    nestedWordClass === WordClass.AV.value
    || nestedWordClass === WordClass.PV.value
  )))
  && (
    removeAccents.removeExcluding(headword).normalize('NFC') === root
    || definitions.find(({ nsibidi }) => (
      nsibidi === root
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
      if (updatedMeta.nominalPrefix && isRootVerb(currentRange, wordData)) {
        solution.push({
          type: PartTypes.VERB_ROOT,
          text: currentRange,
          wordInfo: isRootVerb(currentRange, wordData),
          wordClass: [WordClass.AV.value, WordClass.PV.value],
        });
        updatedMeta.isPreviousVerb = true;
        solutions.push(helper(word, wordData, secondPointer, secondPointer + 1, solution, updatedMeta));
      } else if (!updatedMeta.nominalPrefix && nominalPrefixes.includes(currentRange)) {
        solution.push({
          type: PartTypes.NOMINAL_PREFIX,
          text: currentRange,
          wordClass: [WordClass.ISUF.value, WordClass.ESUF.value],
        });
        updatedMeta.isPreviousVerb = false;
        updatedMeta.negatorPrefixed = false;
        updatedMeta.nominalPrefix = true;
        solutions.push(helper(word, wordData, secondPointer, secondPointer + 1, solution, { ...updatedMeta }));
      }
      secondPointer += 1; // eslint-disable-line
    }
  }
  solutions.forEach((s) => topSolutions.push(s));
};

// Backtracking
export default (rawWord, wordData) => {
  const word = rawWord.toLowerCase().normalize('NFC');
  const firstPointer = 0;
  const secondPointer = 1;
  const allWords = Object.values(wordData).flat();
  const verbs = allWords.filter(({ definitions = [] }) => (
    definitions.find(({ wordClass: nestedWordClass }) => (
      nestedWordClass === WordClass.AV.value
      || nestedWordClass === WordClass.PV.value),
    )));
  console.time('Expand noun time');
  helper(word, { verbs }, firstPointer, secondPointer, [], { depth: 0 });
  const solution = compact(topSolutions).find((s) => {
    const solutionPathText = removeAccents.removeExcluding(s.reduce((finalString, { text }) => (
      `${finalString}${text}`
    ), '') || '').normalize('NFC');
    return solutionPathText === word;
  }) || [];
  console.timeEnd('Expand noun time');
  console.log('Expanded noun: ', solution);
  return solution;
};
