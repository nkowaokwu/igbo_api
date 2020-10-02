import mongoose from 'mongoose';

const { Schema, Types } = mongoose;
const wordSchema = new Schema({
    word: String,
    wordClass: String,
    definitions: [{ type: String }],
    phrases: [{ type: Types.ObjectId, ref: 'Phrase' }],
    examples: [{ type: Types.ObjectId, ref: 'Example' }]
});

export default mongoose.model('Word', wordSchema);
