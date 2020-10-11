import mongoose from 'mongoose';
import { toJSONPlugin } from './plugins';

const { Schema, Types } = mongoose;
const exampleSchema = new Schema({
  example: String,
  parentWord: { type: Types.ObjectId, ref: 'Word' },
  parentPhrase: { type: Types.ObjectId, ref: 'Phrase' },
});

toJSONPlugin(exampleSchema);

export default mongoose.model('Example', exampleSchema);
