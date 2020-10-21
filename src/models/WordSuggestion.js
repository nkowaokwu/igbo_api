import mongoose from 'mongoose';
import { toJSONPlugin } from './plugins';

const { Schema, Types } = mongoose;
const wordSuggestionSchema = new Schema({
  originalWordId: { type: Types.ObjectId, ref: 'Word' },
  word: { type: String, required: true },
  wordClass: { type: String, required: true },
  definitions: {
    type: [{ type: String }],
    validate: (v) => Array.isArray(v) && v.length > 0,
  },
  variations: { type: [{ type: String }], default: [] },
  details: { type: String, default: '' },
  approvals: { type: [{ type: String }], default: [] },
  denials: { type: [{ type: String }], default: [] },
  updatedOn: { type: Date, default: Date.now() },
  merged: { type: Types.ObjectId, ref: 'Word', default: null },
});

toJSONPlugin(wordSuggestionSchema);

export default mongoose.model('WordSuggestion', wordSuggestionSchema);
