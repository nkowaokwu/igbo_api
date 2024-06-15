const functions = require('firebase-functions');
const { api } = require('./build/src/app');

exports.api = functions.https.onRequest(api);
