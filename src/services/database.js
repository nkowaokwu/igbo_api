import mongoose from 'mongoose';
import { MONGO_URI } from '../config';

const DISCONNECTED = 0;

/* Opens a connection to MongoDB */
export const createDbConnection = () => {
  /* Connects to the MongoDB Database */
  const connection = mongoose.createConnection(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
  });

  connection.on('error', console.error.bind(console, 'connection error:'));
  connection.once('open', () => {
    if (process.env.NODE_ENV === 'production') {
      console.log('🗄 Database is connected', process.env.CI, MONGO_URI);
    }
  });
  return connection;
};

/* Closes current connection to MongoDB */
export const disconnectDatabase = () => {
  const db = mongoose.connection;
  if (db.readyState !== DISCONNECTED) {
    db.close();
    db.once('close', () => {
      if (process.env.NODE_ENV === 'production') {
        console.log('🗃 Database is connection closed', process.env.CI, MONGO_URI);
      }
    });
  }
};

export const isConnected = () => mongoose.connection.readyState !== 0;

export const handleCloseConnection = async (connection) => {
  if (typeof connection?.readyState === 'number' && connection?.readyState !== DISCONNECTED) {
    await connection.close();
  }
};
