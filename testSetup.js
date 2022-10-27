import mongoose from 'mongoose';
import { populateAPI } from './__tests__/shared/commands';

export default async () => {
  if (mongoose.connection?.db?.dropDatabase) {
    await mongoose.connection.collection('words').dropIndexes();
    await mongoose.connection.db.dropDatabase();
  }
  await populateAPI();
  await new Promise((resolve) => setTimeout(resolve, 10000));
};
