const functions = require('firebase-functions');
const { api } = require('../dist/app');

exports.api = functions.https.onRequest(api);
