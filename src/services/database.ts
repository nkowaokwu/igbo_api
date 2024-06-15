import mongoose from 'mongoose';
import { MONGO_URI, isTest } from '../config';

const DISCONNECTED = 0;

const isConnected = (): boolean => mongoose.connection.readyState !== 0;

/* Opens a connection to MongoDB */
export const createDbConnection = (): mongoose.Connection => {
  if (isConnected()) {
    return mongoose.connection;
  }
  /* Connects to the MongoDB Database */
  const connection: mongoose.Connection = mongoose.createConnection(MONGO_URI, {
    autoIndex: true,
    readPreference: isTest ? 'primary' : 'nearest',
  });

  connection.on('error', console.error.bind(console, 'connection error:'));
  return connection;
};

export const handleCloseConnection = async (
  connection: mongoose.Connection | undefined
): Promise<void> => {
  if (typeof connection?.readyState === 'number' && connection?.readyState !== DISCONNECTED) {
    await connection.close();
  }
};
