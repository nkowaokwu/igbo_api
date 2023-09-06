import WordClassEnum from './WordClassEnum';
/**
 * This file defines the valid wordClass options for words and wordSuggestions
 */
export default {
  [WordClassEnum.ADJ]: {
    value: WordClassEnum.ADJ,
    label: 'Adjective',
    nsibidiValue: '依名器',
    description: 'An adjective describes a noun. It explains how a noun is.',
  },
  [WordClassEnum.ADV]: {
    value: WordClassEnum.ADV,
    label: 'Adverb',
    nsibidiValue: 'ń器動',
    description: 'A describer for how or the extent to which a verb is performed. Eg. nwayọnwayọ, Ikiike, Ọsịịsọ.',
  },
  [WordClassEnum.AV]: {
    value: WordClassEnum.AV,
    label: 'Active verb',
    nsibidiValue: '動壊',
    description:
      'A verb that is pure action. Can be stopped and started instantly. Grammatically, it has a clear ' +
      'present/ongoing action. Eg ‘gba’, ‘ri’, ‘ga’ etc can be in the clear present/ongoing form ‘na-agba’, ' +
      '‘na-eri’, ‘ga-aga’.',
  },
  [WordClassEnum.MV]: {
    value: WordClassEnum.MV,
    label: 'Medial verb',
    nsibidiValue: '論動',
    description:
      'A medial verb is a verb with two present tense concepts. One is inactive/stative, ' +
      'while the other is progressive/active.',
  },
  [WordClassEnum.PV]: {
    value: WordClassEnum.PV,
    label: 'Passive verb',
    nsibidiValue: 'ò轄動',
    description:
      'An action that tends to be mostly a situation/state. It is not performative. Its ' +
      'command is always spelled like past tense, though toned like a command while its ' +
      'present tense is always its root. Eg. ‘bụ’, ‘nọ’, ‘bi’ etc are conditions/states and ' +
      'their command forms are ‘bụ̀rụ́’, ‘nọ̀rọ́’, ‘bìrí’ while their present is ‘bụ’, ‘nọ’, ‘bi’, respectively.',
  },
  [WordClassEnum.CJN]: {
    value: WordClassEnum.CJN,
    label: 'Conjunction',
    nsibidiValue: '依ǫ接接',
    description: 'A word joins or links two words or two sentences. Eg. Na(And,That), Maka, Ka(That).',
  },
  [WordClassEnum.DEM]: {
    value: WordClassEnum.DEM,
    label: 'Demonstrative',
    nsibidiValue: 'ǫ探動',
    description: 'A word is a pointing word. It shows. Eg. A, Ahụ, Nke, ugbua.',
  },
  [WordClassEnum.NM]: {
    value: 'NM',
    label: 'Name',
    nsibidiValue: '名',
    description: 'Person is uniquely called. Eg. Chiọma, Ezenwa, Naịjiria, Amerịka, etc.',
  },
  [WordClassEnum.NNC]: {
    value: WordClassEnum.NNC,
    label: 'Noun',
    nsibidiValue: '依名',
    description: 'Used to identify any people, place , or thing. Eg. ụlọ, iko, akwụkwọ.',
  },
  [WordClassEnum.ND]: {
    value: WordClassEnum.ND,
    label: 'Nominal Modifier',
    nsibidiValue: '名核伸',
    description:
      'Words act similar to the English adjective and noun. They are described as ' +
      'nominal modifiers since they are technically nouns that provide details like adjectives.',
  },
  [WordClassEnum.NNP]: {
    value: WordClassEnum.NNP,
    label: 'Proper noun',
    nsibidiValue: '依名以',
    description: 'Person/place is uniquely called. Eg. Chiọma, Ezenwa, Naịjiria, Amerịka, etc.',
  },
  [WordClassEnum.CD]: {
    value: WordClassEnum.CD,
    label: 'Number',
    nsibidiValue: '口控',
    description: 'What any digit or group of digits is called. Otu, Abụọ, Atọ.',
  },
  [WordClassEnum.PREP]: {
    value: WordClassEnum.PREP,
    label: 'Preposition',
    nsibidiValue: '簡残',
    description:
      'This is that word you mention before a location time or person. They cannot ' +
      'just exist on their own. A noun must come before them Eg. Na(In, On, At), mgbe/oge, elu, okpuru, Akụkụ.',
  },
  [WordClassEnum.PRN]: {
    value: WordClassEnum.PRN,
    label: 'Pronoun',
    nsibidiValue: '依名衣',
    description: 'Person/place is uniquely called. Eg. Chiọma, Ezenwa, Naịjiria, Amerịka, etc.',
  },
  [WordClassEnum.FW]: {
    value: WordClassEnum.FW,
    label: 'Foreign word',
    nsibidiValue: '接穀',
    description:
      'A word that is known to not be an Igbo word. Mostly does not follow the Igbo words formation pattern.',
  },
  [WordClassEnum.QTF]: {
    value: WordClassEnum.QTF,
    label: 'Quantifier',
    nsibidiValue: '接感口',
    description: 'A word that shows the amount of something. Niile, Ụfọdụ, Imeriime.',
  },
  [WordClassEnum.WH]: {
    value: WordClassEnum.WH,
    label: 'Interrogative',
    nsibidiValue: 'ǹ絵',
    description: 'The typical question tags. Eg. Kedụ?, Ebee?, Olee?, Gịnị?, Ole?.',
  },
  [WordClassEnum.INTJ]: {
    value: WordClassEnum.INTJ,
    label: 'Interjection',
    nsibidiValue: '撃岐営依',
    description: 'These are exclamative words. Eg. Ewoo! Okokokoo! Olooo! Chaị! Ee! Mba!',
  },
  [WordClassEnum.ISUF]: {
    value: WordClassEnum.ISUF,
    label: 'Inflectional suffix',
    nsibidiValue: '壊興動',
    description:
      'Explainable parts of a verb that an attached, especially at the beginning of a ' +
      'verb, to create a tense for the verb. They can occur in other contexts as an ' +
      'entirely different part of speech. Eg. I, Ị, O, Ọ, A, E, N, M, Na-, Ga-. ',
  },
  [WordClassEnum.ESUF]: {
    value: WordClassEnum.ESUF,
    label: 'Extensional suffix',
    nsibidiValue: '壊査動',
    description:
      'Suffixes attached at the end of a verb to add more meaning to the verbs. They ' +
      'also tend to retain their idea when on their own. Some of them stem from other ' +
      'verbs. Eg. -kwa, -rịrị, -ghị, -la, -kwu, -ju, -pụ, etc.',
  },
  [WordClassEnum.SYM]: {
    value: WordClassEnum.SYM,
    label: 'Punctuations',
    nsibidiValue: 'ò韻ǹ肝',
    description: 'These are punctuation marks used in the Igbo language.',
  },
};
