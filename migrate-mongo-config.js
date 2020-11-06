const config = {
  mongodb: {
    url: process.env.MONGO_URL || 'mongodb://localhost:27017',
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
