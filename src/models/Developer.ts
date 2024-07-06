import mongoose from 'mongoose';
import { toJSONPlugin, toObjectPlugin } from './plugins';
import Plan from '../shared/constants/Plan';
import AccountStatus from '../shared/constants/AccountStatus';

const { Schema } = mongoose;
export const developerSchema = new Schema(
  {
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
    firebaseId: { type: String, default: '' },
    stripeId: { type: String, default: '' },
    plan: { type: String, enum: Object.values(Plan), default: Plan.STARTER },
    accountStatus: {
      type: String,
      enum: Object.values(AccountStatus),
      default: AccountStatus.UNPAID,
    },
  },
  { toObject: toObjectPlugin, timestamps: true }
);

toJSONPlugin(developerSchema);
