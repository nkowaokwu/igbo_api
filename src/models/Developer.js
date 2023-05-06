import mongoose from 'mongoose';
import { toJSONPlugin, toObjectPlugin } from './plugins';

const { Schema } = mongoose;
export const developerSchema = new Schema({
  name: { type: String, default: '', required: true },
  apiKey: {
    type: String,
    default: '',
    required: true,
    index: true,
  },
  email: { type: String, default: '', required: true },
  password: { type: String, default: '', required: true },
  usage: {
    date: { type: Date, default: new Date().toISOString() },
    count: { type: Number, default: 0 },
  },
}, { toObject: toObjectPlugin, timestamps: true });

toJSONPlugin(developerSchema);
