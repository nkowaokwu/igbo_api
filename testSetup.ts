import mongoose from 'mongoose';
import { populateAPI } from './__tests__/shared/commands';

/**
 * Responsible for populating the test database.
 * Called before all tests.
 */
export default async () => {
  if (mongoose.connection?.db?.dropDatabase) {
    await mongoose.connection.collection('words').dropIndexes();
    await mongoose.connection.collection('examples').dropIndexes();
    await mongoose.connection.collection('developers').dropIndexes();
    await mongoose.connection.collection('nsibidicharacters').dropIndexes();
    await mongoose.connection.db.dropDatabase();
  }
  await populateAPI();
  await new Promise((resolve) => {
    setTimeout(resolve, 10000);
  });
};
