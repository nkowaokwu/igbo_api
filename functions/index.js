const functions = require('firebase-functions');
const { api } = require('./dist/src/app');

exports.api = functions.https.onRequest(api);
