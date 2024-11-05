const { onRequest } = require('firebase-functions/v2/https');
const { api, demo } = require('./build/src/app');

exports.api_2 = onRequest(
  {
    cors: true,
    concurrency: 500,
    memory: '1GiB',
  },
  api
);

exports.demo = demo;
