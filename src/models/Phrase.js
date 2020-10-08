import mongoose from 'mongoose';
import { toJSONPlugin } from './plugins';

const { Schema, Types } = mongoose;
const phraseSchema = new Schema({
  phrase: String,
  parentWord: { type: Types.ObjectId, ref: 'Word' },
  definitions: [{ type: String }],
  examples: [{ type: Types.ObjectId, ref: 'Example' }],
});

toJSONPlugin(phraseSchema);

export default mongoose.model('Phrase', phraseSchema);
