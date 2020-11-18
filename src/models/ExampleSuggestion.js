import mongoose from 'mongoose';
import { toJSONPlugin, toObjectPlugin, updatedOnHook } from './plugins';

const { Schema, Types } = mongoose;
const exampleSuggestionSchema = new Schema({
  originalExampleId: { type: Types.ObjectId, ref: 'Example', default: null },
  igbo: { type: String, default: '' },
  english: { type: String, default: '' },
  associatedWords: { type: [{ type: Types.ObjectId }], default: [] },
  exampleForSuggestion: { type: Boolean, default: false },
  editorsNotes: { type: String, default: '' },
  userComments: { type: String, default: '' },
  userEmail: { type: String, default: '' },
  approvals: { type: [{ type: String }], default: [] },
  denials: { type: [{ type: String }], default: [] },
  updatedOn: { type: Date, default: Date.now() },
  merged: { type: Types.ObjectId, ref: 'Example', default: null },
  mergedBy: { type: String, default: null },
}, { toObject: toObjectPlugin });

toJSONPlugin(exampleSuggestionSchema);
updatedOnHook(exampleSuggestionSchema);

export default mongoose.model('ExampleSuggestion', exampleSuggestionSchema);
