import mongoose from 'mongoose';
import { toJSONPlugin } from './plugins';

const { Schema } = mongoose;
const genericWordSchema = new Schema({
  word: { type: String, required: true },
  wordClass: { type: String, default: '' },
  definitions: {
    type: [{ type: String }],
    validate: (v) => Array.isArray(v) && v.length > 0,
  },
  variations: { type: [{ type: String }], default: [] },
  details: { type: String, default: '' },
  approvals: { type: Number, default: 0 },
  denials: { type: Number, default: 0 },
  updatedOn: { type: Date, default: Date.now() },
  merged: { type: Boolean, default: false },
});

toJSONPlugin(genericWordSchema);

export default mongoose.model('GenericWord', genericWordSchema);
