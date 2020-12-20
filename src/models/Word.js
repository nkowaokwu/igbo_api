import mongoose from 'mongoose';
import {
  normalizeWordHook,
  toJSONPlugin,
  toObjectPlugin,
  updatedOnHook,
} from './plugins';

const { Schema } = mongoose;
const wordSchema = new Schema({
  word: { type: String, required: true },
  wordClass: { type: String, default: '' },
  definitions: { type: [{ type: String }], default: [] },
  variations: { type: [{ type: String }], default: [] },
  normalized: { type: String, default: '' },
  frequency: { type: Number },
  stems: { type: [{ type: String }], default: [] },
  accented: { type: String, default: '' },
  updatedOn: { type: Date, default: Date.now() },
}, { toObject: toObjectPlugin });

wordSchema.index({ word: 'text', variations: 'text' });

toJSONPlugin(wordSchema);
updatedOnHook(wordSchema);
normalizeWordHook(wordSchema);

const WordModel = mongoose.model('Word', wordSchema);
WordModel.syncIndexes();

export default WordModel;
