import mongoose from 'mongoose';
import { toJSONPlugin, toObjectPlugin } from './plugins';

const { Schema, Types } = mongoose;
const exampleSchema = new Schema({
  igbo: { type: String, default: '' },
  english: { type: String, default: '' },
  associatedWords: { type: [{ type: Types.ObjectId, ref: 'Word' }], default: [] },
  pronunciation: { type: String, default: '' },
}, { toObject: toObjectPlugin, timestamps: true });

toJSONPlugin(exampleSchema);

export default mongoose.model('Example', exampleSchema);
