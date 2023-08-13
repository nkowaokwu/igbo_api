import { Document, Types } from 'mongoose';

export interface Developer {
  name: string;
  apiKey: string;
  email: string;
  password: string;
  usage: {
    date: Date;
    count: number;
  };
}

export interface DeveloperDocument extends Developer, Document<any> {
  id: Types.ObjectId;
}
