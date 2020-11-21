import mongoose from 'mongoose';
import { toJSONPlugin, toObjectPlugin, updatedOnHook } from './plugins';

const { Schema, Types } = mongoose;
const exampleSchema = new Schema({
  igbo: { type: String, default: '' },
  english: { type: String, default: '' },
  associatedWords: { type: [{ type: Types.ObjectId, ref: 'Word' }], default: [] },
  updatedOn: { type: Date, default: Date.now() },
}, { toObject: toObjectPlugin });

toJSONPlugin(exampleSchema);
updatedOnHook(exampleSchema);

export default mongoose.model('Example', exampleSchema);
