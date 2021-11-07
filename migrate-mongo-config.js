import { MONGO_ROOT, DB_NAME } from './src/config';

const config = {
  mongodb: {
    url: process.env.MONGO_URI || MONGO_ROOT,
    databaseName: process.env.DB_NAME || DB_NAME,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  migrationsDir: 'migrations',
  changelogCollectionName: 'changelog',
  migrationFileExtension: '.js',
};

// Return the config as a promise
module.exports = config;
