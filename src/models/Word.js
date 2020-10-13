import mongoose from 'mongoose';
import { toJSONPlugin } from './plugins';

const { Schema, Types } = mongoose;
const wordSchema = new Schema({
  word: String,
  wordClass: String,
  definitions: [{ type: String }],
  examples: [{ type: Types.ObjectId, ref: 'Example' }],
  variations: [{ type: String }],
  normalized: String,
  frequency: Number,
  stems: [{ type: String }],
});

toJSONPlugin(wordSchema);

export default mongoose.model('Word', wordSchema);
