import mongoose from 'mongoose';
import { toJSONPlugin } from './plugins';

const { Schema, Types } = mongoose;
const wordSchema = new Schema({
  word: String,
  wordClass: String,
  definitions: [{ type: String }],
  phrases: [{ type: Types.ObjectId, ref: 'Phrase' }],
  examples: [{ type: Types.ObjectId, ref: 'Example' }],
  variations: [{ type: String }],
});

toJSONPlugin(wordSchema);

export default mongoose.model('Word', wordSchema);
