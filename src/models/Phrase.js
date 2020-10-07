import mongoose from 'mongoose';

const { Schema, Types } = mongoose;
const phraseSchema = new Schema({
  phrase: String,
  parentWord: { type: Types.ObjectId, ref: 'Word' },
  definitions: [{ type: String }],
  examples: [{ type: Types.ObjectId, ref: 'Example' }],
});

export default mongoose.model('Phrase', phraseSchema);
