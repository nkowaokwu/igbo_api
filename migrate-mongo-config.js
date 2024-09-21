const config = {
  mongodb: {
    url: process.env.MONGO_URI || 'mongodb://0.0.0.0:27017',
    databaseName: process.env.DB_NAME || 'igbo_api',
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
