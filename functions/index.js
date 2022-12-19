const functions = require('firebase-functions');
const { api } = require('./build/app');

exports.api = functions.https.onRequest(api);
