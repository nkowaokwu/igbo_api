import mongoose from 'mongoose';
import { toJSONPlugin, toObjectPlugin, updatedOnHook } from './plugins';

const { Schema } = mongoose;
const wordSchema = new Schema({
  word: { type: String, required: true },
  wordClass: { type: String, default: '' },
  definitions: { type: [{ type: String }], default: [] },
  variations: { type: [{ type: String }], default: [] },
  normalized: { type: String, default: '' },
  frequency: { type: Number },
  stems: { type: [{ type: String }], default: [] },
  updatedOn: { type: Date, default: Date.now() },
}, { toObject: toObjectPlugin });

toJSONPlugin(wordSchema);
updatedOnHook(wordSchema);

export default mongoose.model('Word', wordSchema);
