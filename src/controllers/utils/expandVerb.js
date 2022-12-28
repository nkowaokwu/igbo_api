/* eslint-disable */
import compact from 'lodash/compact';
import WordClass from '../../shared/constants/WordClass';
import removeAccents from '../../shared/utils/removeAccents';

// Spell Igbo words with vowels only from the same group
const lightGroup = ['a', 'ị', 'ọ', 'ụ'];
const heavyGroup = ['e', 'i', 'o', 'u'];
const vowels = [...lightGroup, ...heavyGroup];

const getFirstVowel = (word) => {
  for (let i = 0; i < word.length; i += 1) {
    if (vowels.includes(word.charAt(i))) {
      return word.charAt(i);
    }
  }
  throw new Error(`No vowel in word: ${word}`);
};

const getLastVowel = (word) => {
  for (let i = word.length - 1; i >= 0; i -= 1) {
    if (vowels.includes(word.charAt(i))) {
      return word.charAt(i);
    }
  }
  throw new Error(`No vowel in word: ${word}`);
};

const partType = {
  VERB_ROOT: {
    type: 'verb root',
    backgroundColor: 'gray.50',
  },
  NEGATOR: { // Rule #2
    type: 'negator',
    backgroundColor: 'red.50',
  },
  NEGATOR_PREFIX: { // Rule #2
    type: 'negator prefix',
    backgroundColor: 'orange.50',
  },
  STATIVE: { // Rule #3, #9
    type: 'stative',
    backgroundColor: 'yellow.50',
  },
  STATIVE_PREFIX: { // Rule #11
    type: 'stative prefix',
    backgroundColor: 'green.50',
  },
  PRESENT_CONTINUOUS: {
    type: 'present continuous',
    backgroundColor: 'teal.50',
  },
  FUTURE_CONTINUOUS: { // Rule #13
    type: 'future continuous',
    backgroundColor: 'blue.50',
  },
  POTENTIAL_CONTINUOUS_PREFIX: { // Rule #14
    type: 'potential continuous prefix',
    backgroundColor: 'cyan.50',
  },
  INFINITIVE: { // Rule #5, #7
    type: 'infinitive',
    backgroundColor: 'purple.50',
  },
  IMPERATIVE: { // Rule #6
    type: 'imperative',
    backgroundColor: 'pink.50',
  },
  QUALIFIER_OR_PAST: { // Rule #10, #16
    type: 'qualifier or past',
    backgroundColor: 'yellow.200',
  },
  PERFECT_PAST: { // Rule #17, #18
    type: 'perfect past',
    backgroundColor: 'orange.200',
  },
  EXTENSIONAL_SUFFIX: { // Rule #8
    type: 'extensional suffix',
    backgroundColor: 'red.200',
  },
  MULTIPLE_PEOPLE: { // Rule #9
    type: 'multiple people',
    backgroundColor: 'green.200',
  },
  PAST_PERFECT_CONTINUOUS_PREFIX: { // Rule #12
    type: 'past perfect continuous prefix',
    backgroundColor: 'teal.200',
  },
  TIME_BASED: { // Rule #19 (technically a ext suffix + past tense)
    type: 'time based',
    backgroundColor: 'blue.200',
  },
  NEGATIVE: { // Rule #20
    type: 'negative',
    backgroundColor: 'gray.200',
  },
  NEGATIVE_POTENTIAL: { // Rule #21
    type: 'negative potential',
    backgroundColor: 'purple.200',
  },
  NOMINAL_PREFIX: {
    type: 'nominal prefix',
    backgroundColor: 'pink.200',
  },
  NOUN: {
    type: 'noun',
    backgroundColor: 'indigo.200',
  }
}

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
  'nụ'
];

// TODO: verify vowel harmony is correct
const stativePrefixes = [
  'na-',
];

const hasNotYet = [
  'be'
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
  'ga '
];

// TODO: make sure that this precedes a stative prefix
const hasBeenAndStill = [
  'ka '
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
  )
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
  )
);

const topSolutions = [];
const helper = (word, wordData, firstPointer, secondPointer, topSolution, meta) => {
  const updatedMeta = { ...meta };
  updatedMeta.depth += 1;
  let solutions = [topSolution];
  while (secondPointer <= word.length) {
    const solution = [...topSolution];
    const currentRange = (word.substring(firstPointer, secondPointer) || '').trim();
    console.log('the current range', currentRange, updatedMeta.depth);
    if (!updatedMeta.nominalPrefix && prefixes.includes(currentRange)) {
      solution.push({ type: partType.INFINITIVE, text: currentRange, wordClass: [WordClass.ISUF.value, WordClass.ESUF.value] });
      updatedMeta.isPreviousVerb = false;
      solutions.push(helper(word, wordData, secondPointer, secondPointer + 1, solution, updatedMeta));
    } else if (!updatedMeta.isPreviousVerb && isRootVerb(currentRange, wordData)) {
      solution.push({ type: partType.VERB_ROOT, text: currentRange, wordInfo: isRootVerb(currentRange, wordData), wordClass: [WordClass.AV.value, WordClass.MV.value, WordClass.PV.value] });
      updatedMeta.isPreviousVerb = true;
      solutions.push(helper(word, wordData, secondPointer, secondPointer + 1, solution, updatedMeta));
    } else if (
      // TODO: double check nominal prefixes
      // (!updatedMeta.nominalPrefix && nominalPrefixes.includes(currentRange)) ||
      (!updatedMeta.isPreviousVerb && negativePrefixes.includes(currentRange))
    ) {
      // solution.push({ type: partType.NOMINAL_PREFIX, text: currentRange, wordClass: [WordClass.ISUF.value, WordClass.ESUF.value] });
      // updatedMeta.isPreviousVerb = false;
      // updatedMeta.negatorPrefixed = false;
      // updatedMeta.nominalPrefix = true;
      // solutions.push(helper(word, wordData, secondPointer, secondPointer + 1, solution, { ...updatedMeta }));
      if (negativePrefixes.includes(currentRange)) {
        const forkedUpdatedMeta = { ...updatedMeta };
        solution.push({ type: partType.NEGATOR_PREFIX, text: currentRange, wordClass: [WordClass.ISUF.value, WordClass.ESUF.value] });
        forkedUpdatedMeta.isPreviousVerb = false;
        forkedUpdatedMeta.negatorPrefixed = true;
        forkedUpdatedMeta.negativePrefix = currentRange;
        solutions.push(helper(word, wordData, secondPointer, secondPointer + 1, solution, forkedUpdatedMeta));
      }
    } else if (!updatedMeta.nominalPrefix && negativesOrPast.includes(currentRange) && negativePrefixes.includes(currentRange[currentRange.length - 1])) {
      solution.push({ type: updatedMeta.negatorPrefixed ? partType.NEGATOR : partType.QUALIFIER_OR_PAST, text: currentRange, wordClass: [WordClass.ESUF.value] });
      updatedMeta.isPreviousVerb = updatedMeta.negatorPrefixed ? false : true;
      updatedMeta.negativePrefix = '';
      solutions.push(helper(word, wordData, secondPointer, secondPointer + 1, solution, updatedMeta));
    } else if (!updatedMeta.nominalPrefix && suffixes.includes(currentRange)) {
      solution.push({ type: partType.STATIVE, text: currentRange, wordClass: [WordClass.ISUF.value, WordClass.ESUF.value] });
      updatedMeta.isPreviousVerb = false;
      solutions.push(helper(word, wordData, secondPointer, secondPointer + 1, solution, updatedMeta));
    } else if (!updatedMeta.nominalPrefix && rv.includes(currentRange)) {
      solution.push({ type: partType.QUALIFIER_OR_PAST, text: currentRange, wordClass: [WordClass.ISUF.value, WordClass.ESUF.value] });
      updatedMeta.isPreviousVerb = false;
      solutions.push(helper(word, wordData, secondPointer, secondPointer + 1, solution, updatedMeta));
    } else if (!updatedMeta.nominalPrefix && imperatives.includes(currentRange)) {
      solution.push({ type: partType.IMPERATIVE, text: currentRange, wordClass: [WordClass.ISUF.value, WordClass.ESUF.value] });
      updatedMeta.isPreviousVerb = true;
      solutions.push(helper(word, wordData, secondPointer, secondPointer + 1, solution, updatedMeta));
    } else if (!updatedMeta.nominalPrefix && isSuffix(currentRange, wordData)) {
      solution.push({ type: partType.EXTENSIONAL_SUFFIX, text: currentRange, wordInfo: isSuffix(currentRange, wordData), wordClass: [WordClass.ISUF.value, WordClass.ESUF.value] });
      updatedMeta.isPreviousVerb = true;
      solutions.push(helper(word, wordData, secondPointer, secondPointer + 1, solution, updatedMeta));
    } else if (!updatedMeta.nominalPrefix && multiplePeople.includes(currentRange)) {
      // TODO: could be other meaning
      solution.push({ type: partType.MULTIPLE_PEOPLE, text: currentRange, wordClass: [WordClass.ISUF.value, WordClass.ESUF.value] });
      updatedMeta.isPreviousVerb = false;
      solutions.push(helper(word, wordData, secondPointer, secondPointer + 1, solution, updatedMeta));
    } else if (!updatedMeta.nominalPrefix && stativePrefixes.includes(currentRange)) {
      solution.push({ type: partType.STATIVE_PREFIX, text: currentRange, wordClass: [WordClass.ISUF.value, WordClass.ESUF.value] });
      updatedMeta.isPreviousVerb = false;
      solutions.push(helper(word, wordData, secondPointer, secondPointer + 1, solution, updatedMeta));
    } else if (!updatedMeta.nominalPrefix && nots.includes(currentRange)) {
      solution.push({ type: partType.NEGATIVE, text: currentRange, wordClass: [WordClass.ISUF.value, WordClass.ESUF.value] });
      updatedMeta.isPreviousVerb = false;
      solutions.push(helper(word, wordData, secondPointer, secondPointer + 1, solution, updatedMeta));
    } else if (!updatedMeta.nominalPrefix && hasNotYet.includes(currentRange)) {
      solution.push({ type: partType.NEGATIVE_POTENTIAL, text: currentRange, wordClass: [WordClass.ISUF.value, WordClass.ESUF.value] });
      updatedMeta.isPreviousVerb = false;
      solutions.push(helper(word, wordData, secondPointer, secondPointer + 1, solution, updatedMeta));
    } else if (!updatedMeta.nominalPrefix && had.includes(currentRange)) {
      solution.push({ type: partType.PERFECT_PAST, text: currentRange, wordClass: [WordClass.ISUF.value, WordClass.ESUF.value] });
      updatedMeta.isPreviousVerb = false;
      solutions.push(helper(word, wordData, secondPointer, secondPointer + 1, solution, updatedMeta));
    } else if (!updatedMeta.nominalPrefix && shallBe.includes(currentRange)) {
      solution.push({ type: partType.POTENTIAL_CONTINUOUS_PREFIX, text: currentRange, wordClass: [WordClass.ISUF.value, WordClass.ESUF.value] });
      updatedMeta.isPreviousVerb = false;
      solutions.push(helper(word, wordData, secondPointer, secondPointer + 1, solution, updatedMeta));
    } else if (!updatedMeta.nominalPrefix && will.includes(currentRange)) {
      solution.push({ type: partType.FUTURE_CONTINUOUS, text: currentRange, wordClass: [WordClass.ISUF.value, WordClass.ESUF.value] });
      updatedMeta.isPreviousVerb = false;
      solutions.push(helper(word, wordData, secondPointer, secondPointer + 1, solution, updatedMeta));
    } else if (!updatedMeta.nominalPrefix && hasBeenAndStill.includes(currentRange)) {
      solution.push({ type: partType.PAST_PERFECT_CONTINUOUS_PREFIX, text: currentRange, wordClass: [WordClass.ISUF.value, WordClass.ESUF.value] });
      updatedMeta.isPreviousVerb = false;
      solutions.push(helper(word, wordData, secondPointer, secondPointer + 1, solution, updatedMeta));
    }
    secondPointer += 1;
  }
  solutions.forEach((s) => topSolutions.push(s));
}

// Backtracking
export default (rawWord, wordData) => {
  const word = rawWord.toLowerCase().normalize('NFC');
  let firstPointer = 0;
  let secondPointer = 1;
  const allWords = Object.values(wordData).flat();
  const verbs = allWords.filter(({ definitions = [] }) => (
    definitions.find(({ wordClass: nestedWordClass }) => (
      nestedWordClass === WordClass.AV.value
      || nestedWordClass === WordClass.MV.value
      || nestedWordClass === WordClass.PV.value)
  )));
  const suffixes = allWords.filter(({ definitions = [] }) => (
    definitions.find(({ wordClass: nestedWordClass }) => (
      nestedWordClass === WordClass.ESUF.value
      || nestedWordClass === WordClass.ISUF.value)
  )));
  helper(word, { verbs, suffixes }, firstPointer, secondPointer, [], { depth: 0 });
  let solution = compact(topSolutions).find((s) => {
    const solutionPathText = removeAccents.removeExcluding(s.reduce((finalString, { text }) => (
      `${finalString}${text}`
    ), '') || '').normalize('NFC');
    return solutionPathText === word;
  }) || [];
  console.log('Expanded verb: ', solution);
  return solution;
}
