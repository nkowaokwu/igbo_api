import mongoose from 'mongoose';
import every from 'lodash/every';
import { toJSONPlugin, toObjectPlugin } from './plugins';
import Dialects from '../shared/constants/Dialect';
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
  nsibidi: { type: String, default: '' },
  igboDefinitions: {
    type: [{
      igbo: String,
      nsibidi: String,
    }],
    default: [],
  },
}, { _id: true });

const dialectSchema = new Schema({
  word: { type: String, required: true, index: true },
  variations: { type: [{ type: String }], default: [] },
  dialects: { type: [{ type: String }], validate: (v) => every(v, (dialect) => Dialects[dialect].value), default: [] },
  pronunciation: { type: String, default: '' },
}, { toObject: toObjectPlugin });

export const wordSchema = new Schema({
  word: { type: String, required: true },
  wordPronunciation: { type: String, default: '' },
  conceptualWord: { type: String, default: '' },
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
  stems: { type: [{ type: Types.ObjectId, ref: 'Word' }], default: [] },
}, { toObject: toObjectPlugin, timestamps: true, autoIndex: true });

wordSchema.index({
  word: 1,
});
wordSchema.index({
  'definitions.definitions': 'text',
});
wordSchema.index({
  'definitions.wordClass': 1,
});
wordSchema.index({
  variations: 1,
});
wordSchema.index({
  'definitions.nsibidi': 1,
});
wordSchema.index({
  'dialects.word': 1,
});
wordSchema.index({
  'tenses.infinitive': 1,
});
wordSchema.index({
  'tenses.imperative': 1,
});
wordSchema.index({
  'tenses.simplePast': 1,
});
wordSchema.index({
  'tenses.simplePresent': 1,
});
wordSchema.index({
  'tenses.presentContinuous': 1,
});
wordSchema.index({
  'tenses.future': 1,
});

toJSONPlugin(wordSchema);

const WordModel = mongoose.model('Word', wordSchema);
WordModel.syncIndexes();
