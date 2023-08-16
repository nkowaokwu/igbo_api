import { Document, Types } from 'mongoose';
import StatTypes from '../shared/constants/StatTypes';

export interface Stat {
  type: StatTypes;
  authorId: string;
  value: number;
}

export interface StatDocument extends Stat, Document<any> {
  id: Types.ObjectId;
}
