const PartTypes = {
  VERB_ROOT: {
    type: 'verb root',
    backgroundColor: 'gray.50',
  },
  NEGATOR: {
    // Rule #2
    type: 'negator',
    backgroundColor: 'red.50',
  },
  NEGATOR_PREFIX: {
    // Rule #2
    type: 'negator prefix',
    backgroundColor: 'orange.50',
  },
  STATIVE: {
    // Rule #3, #9
    type: 'stative',
    backgroundColor: 'yellow.50',
  },
  STATIVE_PREFIX: {
    // Rule #11
    type: 'stative prefix',
    backgroundColor: 'green.50',
  },
  STATIVE_PREFIX_PAIR: {
    // Rule #11
    type: 'stative prefix pair',
    backgroundColor: 'green.50',
  },
  PRESENT_CONTINUOUS: {
    type: 'present continuous',
    backgroundColor: 'teal.50',
  },
  FUTURE_CONTINUOUS: {
    // Rule #13
    type: 'future continuous',
    backgroundColor: 'blue.50',
  },
  POTENTIAL_CONTINUOUS_PREFIX: {
    // Rule #14
    type: 'potential continuous prefix',
    backgroundColor: 'cyan.50',
  },
  INFINITIVE: {
    // Rule #5, #7
    type: 'infinitive',
    backgroundColor: 'purple.50',
  },
  IMPERATIVE: {
    // Rule #6
    type: 'imperative',
    backgroundColor: 'pink.50',
  },
  QUALIFIER_OR_PAST: {
    // Rule #10, #16
    type: 'qualifier or past',
    backgroundColor: 'yellow.200',
  },
  PERFECT_PAST: {
    // Rule #17, #18
    type: 'perfect past',
    backgroundColor: 'orange.200',
  },
  EXTENSIONAL_SUFFIX: {
    // Rule #8
    type: 'extensional suffix',
    backgroundColor: 'red.200',
  },
  MULTIPLE_PEOPLE: {
    // Rule #9
    type: 'multiple people',
    backgroundColor: 'green.200',
  },
  PAST_PERFECT_CONTINUOUS_PREFIX: {
    // Rule #12
    type: 'past perfect continuous prefix',
    backgroundColor: 'teal.200',
  },
  TIME_BASED: {
    // Rule #19 (technically a ext suffix + past tense)
    type: 'time based',
    backgroundColor: 'blue.200',
  },
  NEGATIVE: {
    // Rule #20
    type: 'negative',
    backgroundColor: 'gray.200',
  },
  NEGATIVE_POTENTIAL: {
    // Rule #21
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
  },
};

export default PartTypes;
