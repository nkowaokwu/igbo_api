const functions = require('firebase-functions');
const { api } = require('./src/app');

exports.api = functions
  .https
  .onRequest(api);
