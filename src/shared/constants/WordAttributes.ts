import WordAttributeEnum from './WordAttributeEnum';

// Word characteristics
const WordAttributes = {
  [WordAttributeEnum.IS_STANDARD_IGBO]: {
    value: WordAttributeEnum.IS_STANDARD_IGBO,
    label: 'Is Standard Igbo',
  },
  [WordAttributeEnum.IS_ACCENTED]: {
    value: WordAttributeEnum.IS_ACCENTED,
    label: 'Is Accented',
  },
  [WordAttributeEnum.IS_COMPLETE]: {
    value: WordAttributeEnum.IS_COMPLETE,
    label: 'Is Complete',
  },
  [WordAttributeEnum.IS_SLANG]: {
    value: WordAttributeEnum.IS_SLANG,
    label: 'Is Slang',
  },
  [WordAttributeEnum.IS_CONSTRUCTED_TERM]: {
    value: WordAttributeEnum.IS_CONSTRUCTED_TERM,
    label: 'Is Constructed Term',
  },
  [WordAttributeEnum.IS_BORROWED_TERM]: {
    value: WordAttributeEnum.IS_BORROWED_TERM,
    label: 'Is Borrowed Term',
  },
  [WordAttributeEnum.IS_STEM]: {
    value: WordAttributeEnum.IS_STEM,
    label: 'Is Stem',
  },
  [WordAttributeEnum.IS_COMMON]: {
    value: WordAttributeEnum.IS_COMMON,
    label: 'Is Common Term',
  },
};

export default WordAttributes;
