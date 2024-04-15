import { Document, Types } from 'mongoose';
import Plan from '../shared/constants/Plan';

export interface DeveloperClientData {
  name: string;
  apiKey: string;
  email: string;
  password: string;
  stripeId: string;
  firebaseId: string;
  plan: Plan;
}

export interface Developer extends DeveloperClientData {
  usage: {
    date: Date,
    count: number,
  };
}

export interface DeveloperDocument extends Developer, Document<any> {
  id: Types.ObjectId;
}
