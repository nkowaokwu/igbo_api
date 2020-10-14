import mongoose from 'mongoose';
import { toJSONPlugin } from './plugins';

const { Schema, Types } = mongoose;
const exampleSchema = new Schema({
  igbo: String,
  english: String,
  associatedWords: [{ type: Types.ObjectId, ref: 'Word' }],
});

toJSONPlugin(exampleSchema);

export default mongoose.model('Example', exampleSchema);
