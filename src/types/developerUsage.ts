import { Document, Types } from 'mongoose';
import ApiType from 'src/shared/constants/ApiType';

export interface DeveloperUsage {
  developerId: Types.ObjectId | string;
  usageType: ApiType;
  usage: {
    date: Date,
    count: number,
  };
}

export interface DeveloperUsageDocument extends DeveloperUsage, Document<any> {
  id: Types.ObjectId;
}
