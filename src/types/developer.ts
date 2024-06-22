import { Document, Types } from 'mongoose';
import Plan from '../shared/constants/Plan';
import { Status } from '../shared/constants/AccountStatus';

export interface DeveloperClientData {
  name: string;
  apiKey: string;
  email: string;
  password: string;
  stripeId: string;
  firebaseId: string;
  plan: Plan;
  accountStatus: Status;
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

export interface DeveloperResponse extends Developer {
  id: string;
}
