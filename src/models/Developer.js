import mongoose from 'mongoose';
import { toJSONPlugin, toObjectPlugin, updatedOnHook } from './plugins';

const { Schema } = mongoose;
const developerSchema = new Schema({
  name: { type: String, default: '', required: true },
  apiKey: { type: String, default: '', required: true },
  email: { type: String, default: '', required: true },
  password: { type: String, default: '', required: true },
  hosts: [{ type: String, default: '' }],
  usage: {
    date: { type: Date, default: Date.now() },
    count: { type: Number, default: 0 },
  },
  updatedOn: { type: Date, default: Date.now() },
}, { toObject: toObjectPlugin });

toJSONPlugin(developerSchema);
updatedOnHook(developerSchema);

export default mongoose.model('Developer', developerSchema);
