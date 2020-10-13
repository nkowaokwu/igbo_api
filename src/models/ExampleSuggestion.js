import mongoose from 'mongoose';
import { toJSONPlugin } from './plugins';

const { Schema, Types } = mongoose;
const exampleSuggestionSchema = new Schema({
  originalExampleId: { type: Types.ObjectId, ref: 'Word' },
  igbo: { type: String, default: '' },
  english: { type: String, default: '' },
  associatedWords: { type: [{ type: Types.ObjectId, ref: 'Word' }], default: [] },
  details: { type: String, default: '' },
  approvals: { type: Number, default: 0 },
  denials: { type: Number, default: 0 },
  updatedOn: { type: Date, default: Date.now() },
  merged: { type: Boolean, default: false },
});

toJSONPlugin(exampleSuggestionSchema);

export default mongoose.model('ExampleSuggestion', exampleSuggestionSchema);
