import mongoose from 'mongoose';
import { toJSONPlugin } from './plugins';

const { Schema, Types } = mongoose;
const wordSchema = new Schema({
  word: { type: String, required: true },
  wordClass: { type: String, default: '' },
  definitions: { type: [{ type: String }], default: [] },
  examples: { type: [{ type: Types.ObjectId, ref: 'Example' }], default: [] },
  variations: { type: [{ type: String }], default: [] },
  normalized: { type: String, default: '' },
  frequency: { type: Number },
  stems: { type: [{ type: String }], default: [] },
});

toJSONPlugin(wordSchema);

export default mongoose.model('Word', wordSchema);
