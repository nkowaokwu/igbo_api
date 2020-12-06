import mongoose from 'mongoose';
import {
  toJSONPlugin,
  toObjectPlugin,
  updatedOnHook,
  normalizeExampleHook,
} from './plugins';

const { Schema, Types } = mongoose;
const exampleSchema = new Schema({
  igbo: { type: String, default: '' },
  english: { type: String, default: '' },
  associatedWords: { type: [{ type: Types.ObjectId, ref: 'Word' }], default: [] },
  accented: { type: String, default: '' },
  updatedOn: { type: Date, default: Date.now() },
}, { toObject: toObjectPlugin });

toJSONPlugin(exampleSchema);
updatedOnHook(exampleSchema);
normalizeExampleHook(exampleSchema);

export default mongoose.model('Example', exampleSchema);
