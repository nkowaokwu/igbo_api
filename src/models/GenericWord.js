import mongoose from 'mongoose';
import { toJSONPlugin, toObjectPlugin, updatedOnHook } from './plugins';

const { Schema, Types } = mongoose;
const genericWordSchema = new Schema({
  word: { type: String, required: true },
  wordClass: { type: String, default: '' },
  definitions: {
    type: [{ type: String }],
    validate: (v) => Array.isArray(v) && v.length > 0,
  },
  variations: { type: [{ type: String }], default: [] },
  editorsNotes: { type: String, default: '' },
  userComments: { type: String, default: '' },
  userEmail: { type: String, default: '' },
  approvals: { type: [{ type: String }], default: [] },
  denials: { type: [{ type: String }], default: [] },
  updatedOn: { type: Date, default: Date.now() },
  merged: { type: Types.ObjectId, ref: 'Word', default: null },
  mergedBy: { type: String, default: null },
}, { toObject: toObjectPlugin });

toJSONPlugin(genericWordSchema);
updatedOnHook(genericWordSchema);

genericWordSchema.pre('findOneAndDelete', async function (next) {
  const genericWord = await this.model.findOne(this.getQuery());
  await mongoose.model('ExampleSuggestion')
    .deleteMany({ associatedWords: genericWord.id });
  next();
});

export default mongoose.model('GenericWord', genericWordSchema);
