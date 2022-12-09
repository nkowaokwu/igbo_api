import mongoose from 'mongoose';
import { toJSONPlugin, toObjectPlugin } from './plugins';
import ExampleStyles from '../shared/constants/ExampleStyles';

const { Schema, Types } = mongoose;
export const exampleSchema = new Schema({
  igbo: { type: String, default: '' },
  english: { type: String, default: '' },
  meaning: { type: String, default: '' },
  nsibidi: { type: String, default: '' },
  style: {
    type: String,
    enum: Object.values(ExampleStyles).map(({ value }) => value),
    default: ExampleStyles.NO_STYLE.value,
  },
  associatedWords: { type: [{ type: Types.ObjectId, ref: 'Word' }], default: [] },
  associatedDefinitionsSchemas: { type: [{ type: Types.ObjectId }], default: [] },
  pronunciation: { type: String, default: '' },
}, { toObject: toObjectPlugin, timestamps: true });

toJSONPlugin(exampleSchema);
