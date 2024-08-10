const { onRequest } = require('firebase-functions/v2/https');

const { api } = require('./build/src/app');

exports.api_2 = onRequest(
  {
    cors: true,
    concurrency: 500,
  },
  api
);
