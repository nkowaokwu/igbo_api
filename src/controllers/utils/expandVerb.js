/* eslint-disable */
import Versions from '../../shared/constants/Versions';
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

const helper = (word, wordData, firstPointer, secondPointer, topSolution, meta, version) => {
  const updatedMeta = { ...meta };
  updatedMeta.depth += 1;
  const allWords = Object.values(wordData).flat();
  const isRootVerb = (root) => allWords.find(({ word: headword, wordClass, definitions = [], ...rest }) => {
    return (version === Versions.VERSION_1 ? (
      wordClass === WordClass.AV.value
      || wordClass === WordClass.MV.value
      || wordClass === WordClass.PV.value
    ) : definitions.find(({ wordClass: nestedWordClass }) => (
      nestedWordClass === WordClass.AV.value
      || nestedWordClass === WordClass.MV.value
      || nestedWordClass === WordClass.PV.value)))
    && removeAccents.removeExcluding(headword).normalize('NFC') === root;
  }) ;
  const isSuffix = (root) => allWords.find(({ word: headword, wordClass, definitions = [] }) => {
    return (version === Versions.VERSION_1 ? (
      wordClass === WordClass.ESUF.value
      || wordClass === WordClass.ISUF.value
    ) : definitions.find(({ wordClass }) => (
      wordClass === WordClass.ESUF.value
      || wordClass === WordClass.ISUF.value
    )))
    && removeAccents.removeExcluding(headword).replace('-', '').normalize('NFC') === root
  });
  
  let solutions = [topSolution  ];
  while (secondPointer <= word.length) {
    const solution = [...topSolution];
    let tempSolution = solution;
    const currentRange = word.substring(firstPointer, secondPointer);
    if (prefixes.includes(currentRange)) {
      solution.push({ type: partType.INFINITIVE, text: currentRange, wordClass: [WordClass.ISUF.value, WordClass.ESUF.value] });
      updatedMeta.isPreviousVerb = false;
      tempSolution = helper(word, wordData, secondPointer, secondPointer + 1, solution, updatedMeta, version);
    } else if (!updatedMeta.isPreviousVerb && isRootVerb(currentRange)) {
      solution.push({ type: partType.VERB_ROOT, text: currentRange, wordInfo: isRootVerb(currentRange), wordClass: [WordClass.AV.value, WordClass.MV.value, WordClass.PV.value] });
      updatedMeta.isPreviousVerb = true;
      tempSolution = helper(word, wordData, secondPointer, secondPointer + 1, solution, updatedMeta, version);
    } else if (!updatedMeta.isPreviousVerb && negativePrefixes.includes(currentRange)) {
      solution.push({ type: partType.NEGATOR_PREFIX, text: currentRange, wordClass: [WordClass.ISUF.value, WordClass.ESUF.value] });
      updatedMeta.isPreviousVerb = false;
      updatedMeta.negatorPrefixed = true;
      tempSolution = helper(word, wordData, secondPointer, secondPointer + 1, solution, updatedMeta, version);
    } else if (negativesOrPast.includes(currentRange)) {
      solution.push({ type: updatedMeta.negatorPrefixed ? partType.NEGATOR : partType.QUALIFIER_OR_PAST, text: currentRange, wordClass: [WordClass.ESUF.value] });
      updatedMeta.isPreviousVerb = updatedMeta.negatorPrefixed ? false : true;
      tempSolution = helper(word, wordData, secondPointer, secondPointer + 1, solution, updatedMeta, version);
    } else if (suffixes.includes(currentRange)) {
      solution.push({ type: partType.STATIVE, text: currentRange, wordClass: [WordClass.ISUF.value, WordClass.ESUF.value] });
      updatedMeta.isPreviousVerb = false;
      tempSolution = helper(word, wordData, secondPointer, secondPointer + 1, solution, updatedMeta, version);
    } else if (rv.includes(currentRange)) {
      solution.push({ type: partType.QUALIFIER_OR_PAST, text: currentRange, wordClass: [WordClass.ISUF.value, WordClass.ESUF.value] });
      updatedMeta.isPreviousVerb = false;
      tempSolution = helper(word, wordData, secondPointer, secondPointer + 1, solution, updatedMeta, version);
    } else if (imperatives.includes(currentRange)) {
      solution.push({ type: partType.IMPERATIVE, text: currentRange, wordClass: [WordClass.ISUF.value, WordClass.ESUF.value] });
      updatedMeta.isPreviousVerb = true;
      tempSolution = helper(word, wordData, secondPointer, secondPointer + 1, solution, updatedMeta, version);
    } else if (isSuffix(currentRange)) {
      solution.push({ type: partType.EXTENSIONAL_SUFFIX, text: currentRange, wordInfo: isSuffix(currentRange),  wordClass: [WordClass.ISUF.value, WordClass.ESUF.value] });
      updatedMeta.isPreviousVerb = true;
      tempSolution = helper(word, wordData, secondPointer, secondPointer + 1, solution, updatedMeta, version);
    } else if (multiplePeople.includes(currentRange)) {
      // TODO: could be other meaning
      solution.push({ type: partType.MULTIPLE_PEOPLE, text: currentRange, wordClass: [WordClass.ISUF.value, WordClass.ESUF.value] });
      updatedMeta.isPreviousVerb = false;
      tempSolution = helper(word, wordData, secondPointer, secondPointer + 1, solution, updatedMeta, version);
    } else if (stativePrefixes.includes(currentRange)) {
      solution.push({ type: partType.STATIVE_PREFIX, text: currentRange, wordClass: [WordClass.ISUF.value, WordClass.ESUF.value] });
      updatedMeta.isPreviousVerb = false;
      tempSolution = helper(word, wordData, secondPointer, secondPointer + 1, solution, updatedMeta, version);
    } else if (nots.includes(currentRange)) {
      solution.push({ type: partType.NEGATIVE, text: currentRange, wordClass: [WordClass.ISUF.value, WordClass.ESUF.value] });
      updatedMeta.isPreviousVerb = false;
      tempSolution = helper(word, wordData, secondPointer, secondPointer + 1, solution, updatedMeta, version);
    } else if (hasNotYet.includes(currentRange)) {
      solution.push({ type: partType.NEGATIVE_POTENTIAL, text: currentRange, wordClass: [WordClass.ISUF.value, WordClass.ESUF.value] });
      updatedMeta.isPreviousVerb = false;
      tempSolution = helper(word, wordData, secondPointer, secondPointer + 1, solution, updatedMeta, version);
    } else if (had.includes(currentRange)) {
      solution.push({ type: partType.PERFECT_PAST, text: currentRange, wordClass: [WordClass.ISUF.value, WordClass.ESUF.value] });
      updatedMeta.isPreviousVerb = false;
      tempSolution = helper(word, wordData, secondPointer, secondPointer + 1, solution, updatedMeta, version);
    } else if (shallBe.includes(currentRange)) {
      solution.push({ type: partType.POTENTIAL_CONTINUOUS_PREFIX, text: currentRange, wordClass: [WordClass.ISUF.value, WordClass.ESUF.value] });
      updatedMeta.isPreviousVerb = false;
      tempSolution = helper(word, wordData, secondPointer, secondPointer + 1, solution, updatedMeta, version);
    } else if (will.includes(currentRange)) {
      solution.push({ type: partType.FUTURE_CONTINUOUS, text: currentRange, wordClass: [WordClass.ISUF.value, WordClass.ESUF.value] });
      updatedMeta.isPreviousVerb = false;
      tempSolution = helper(word, wordData, secondPointer, secondPointer + 1, solution, updatedMeta, version);
    } else if (hasBeenAndStill.includes(currentRange)) {
      solution.push({ type: partType.PAST_PERFECT_CONTINUOUS_PREFIX, text: currentRange, wordClass: [WordClass.ISUF.value, WordClass.ESUF.value]  });
      updatedMeta.isPreviousVerb = false;
      tempSolution = helper(word, wordData, secondPointer, secondPointer + 1, solution, updatedMeta, version);
    }
    solutions.push(tempSolution);
    secondPointer += 1;
  }
  return solutions.reduce((longestSolution, solution) => (
    longestSolution.length >= solution.length ? longestSolution : solution, []
  ));
}

// Backtracking
export default (word, wordData, version) => {
  const normalizedWord = word.toLowerCase().normalize('NFC');
  let firstPointer = 0;
  let secondPointer = 1;
  return helper(normalizedWord, wordData, firstPointer, secondPointer, [], { depth: 0 }, version)
    .map(({ text, ...rest }) => (
      { ...rest, text: text.trim() }
    ));
}
