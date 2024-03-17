import { Document, Types } from 'mongoose';

export interface DeveloperClientData {
  name: string;
  apiKey: string;
  email: string;
  password: string;
  stripeId: string;
  firebaseId: string;
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
