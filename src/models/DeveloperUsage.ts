import mongoose from 'mongoose';
import ApiType from '../shared/constants/ApiType';
import { toJSONPlugin, toObjectPlugin } from './plugins';

const { Schema, Types } = mongoose;
export const developerUsageSchema = new Schema(
  {
    developerId: { type: Types.ObjectId, ref: 'Developer', required: true },
    usageType: { type: String, enum: ApiType, default: ApiType.DICTIONARY },
    usage: {
      date: { type: Date, default: new Date().toISOString() },
      count: { type: Number, default: 0 },
    },
  },
  { toObject: toObjectPlugin, timestamps: true }
);

toJSONPlugin(developerUsageSchema);
