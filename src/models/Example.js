import mongoose from 'mongoose';

const { Schema, Types } = mongoose;
const exampleSchema = new Schema({
  example: String,
  parentWord: { type: Types.ObjectId, ref: 'Word' },
  parentPhrase: { type: Types.ObjectId, ref: 'Phrase' },
});

export default mongoose.model('Example', exampleSchema);
