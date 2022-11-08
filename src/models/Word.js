import mongoose from 'mongoose';
import { every } from 'lodash';
import { toJSONPlugin, toObjectPlugin } from './plugins';
import Dialects from '../shared/constants/Dialects';
import Tenses from '../shared/constants/Tenses';
import WordClass from '../shared/constants/WordClass';
import WordAttributes from '../shared/constants/WordAttributes';
import WordTags from '../shared/constants/WordTags';

const { Schema, Types } = mongoose;

const definitionSchema = new Schema({
  wordClass: {
    type: String,
    default: WordClass.NNC.value,
    enum: Object.values(WordClass).map(({ value }) => value),
  },
  definitions: { type: [{ type: String }], default: [] },
}, { _id: true });

const dialectSchema = new Schema({
  word: { type: String, required: true, index: true },
  variations: { type: [{ type: String }], default: [] },
  dialects: { type: [{ type: String }], validate: (v) => every(v, (dialect) => Dialects[dialect].value), default: [] },
  pronunciation: { type: String, default: '' },
}, { toObject: toObjectPlugin });

const wordSchema = new Schema({
  word: { type: String, required: true },
  definitions: [{
    type: definitionSchema,
    validate: (definitions) => (
      Array.isArray(definitions)
      && definitions.length > 0
    ),
  }],
  dialects: { type: [dialectSchema], default: [] },
  tags: {
    type: [String],
    default: [],
    validate: (v) => (
      v.every((tag) => Object.values(WordTags).map(({ value }) => value).includes(tag))
    ),
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
  attributes: Object.entries(WordAttributes)
    .reduce((finalAttributes, [, { value }]) => ({
      ...finalAttributes,
      [value]: { type: Boolean, default: false },
    }), {}),
  pronunciation: { type: String, default: '' },
  variations: { type: [{ type: String }], default: [] },
  frequency: { type: Number },
  relatedTerms: { type: [{ type: Types.ObjectId, ref: 'Word' }], default: [] },
  hypernyms: { type: [{ type: Types.ObjectId, ref: 'Word' }], default: [] },
  hyponyms: { type: [{ type: Types.ObjectId, ref: 'Word' }], default: [] },
  stems: { type: [{ type: String }], default: [] },
  nsibidi: { type: String, default: '' },
}, { toObject: toObjectPlugin, timestamps: true });

const tensesIndexes = Object.values(Tenses).reduce((finalIndexes, tense) => ({
  ...finalIndexes,
  [`tenses.${tense.value}`]: 'text',
}), {});

wordSchema.index({
  word: 'text',
  variations: 'text',
  'dialects.word': 'text',
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
