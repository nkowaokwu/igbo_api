import mongoose from 'mongoose';
import { every, has, partial } from 'lodash';
import { toJSONPlugin, toObjectPlugin } from './plugins';
import Dialects from '../shared/constants/Dialects';
import Tenses from '../shared/constants/Tenses';
import WordClass from '../shared/constants/WordClass';

const REQUIRED_DIALECT_KEYS = ['variations', 'dialects', 'pronunciation'];
const REQUIRED_DIALECT_CONSTANT_KEYS = ['code', 'value', 'label'];

const { Schema, Types } = mongoose;
const wordSchema = new Schema({
  word: { type: String, required: true },
  wordClass: {
    type: String,
    default: WordClass.NNC.value,
    enum: Object.values(WordClass).map(({ value }) => value),
  },
  definitions: { type: [{ type: String }], default: [] },
  dialects: {
    type: Object,
    validate: (v) => {
      const dialectValues = Object.values(v);
      return dialectValues.every((dialectValue) => (
        every(REQUIRED_DIALECT_KEYS, partial(has, dialectValue))
        && every(dialectValue.dialects, (dialect) => (
          every(REQUIRED_DIALECT_CONSTANT_KEYS, partial(has, Dialects[dialect]))
        ))
        && Array.isArray(dialectValue.dialects)
        && every(dialectValue.dialects, (dialect) => Dialects[dialect].value)
        && typeof dialectValue.pronunciation === 'string'
        && Array.isArray(dialectValue.variations)
      ));
    },
    required: false,
    default: {},
  },
  tenses: {
    type: Object,
    validate: (v) => {
      const tenseValues = Object.values(Tenses);
      Object.keys(v).every((key) => (
        tenseValues.find(({ value: tenseValue }) => key === tenseValue)
      ));
    },
    required: false,
    default: {},
  },
  pronunciation: { type: String, default: '' },
  isAccented: { type: Boolean, default: false },
  isStandardIgbo: { type: Boolean, default: false },
  variations: { type: [{ type: String }], default: [] },
  frequency: { type: Number },
  synonyms: { type: [{ type: Types.ObjectId, ref: 'Word' }], default: [] },
  antonyms: { type: [{ type: Types.ObjectId, ref: 'Word' }], default: [] },
  hypernyms: { type: [{ type: Types.ObjectId, ref: 'Word' }], default: [] },
  hyponyms: { type: [{ type: Types.ObjectId, ref: 'Word' }], default: [] },
  stems: { type: [{ type: String }], default: [] },
  nsibidi: { type: String, default: '' },
  isComplete: { type: Boolean, default: false },
}, { toObject: toObjectPlugin, timestamps: true });

const tensesIndexes = Object.values(Tenses).reduce((finalIndexes, tense) => ({
  ...finalIndexes,
  [`tenses.${tense.value}`]: 'text',
}), {});

wordSchema.index({
  word: 'text',
  variations: 'text',
  dialects: 'text',
  ...tensesIndexes,
  nsibidi: 'text',
}, {
  weights: {
    word: 10,
    tenses: 9,
    dialects: 8,
    vairations: 9,
    nsibidi: 5,
  },
  name: 'Word text index',
});

toJSONPlugin(wordSchema);

const WordModel = mongoose.model('Word', wordSchema);
WordModel.syncIndexes();

export default WordModel;
