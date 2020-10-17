import mongoose from 'mongoose';
import { toJSONPlugin } from './plugins';

const { Schema, Types } = mongoose;
const exampleSchema = new Schema({
  igbo: { type: String, default: '' },
  english: { type: String, default: '' },
  associatedWords: { type: [{ type: Types.ObjectId, ref: 'Word' }], default: [] },
});

toJSONPlugin(exampleSchema);

export default mongoose.model('Example', exampleSchema);
