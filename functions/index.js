const functions = require('firebase-functions');
const { api } = require('./build/app');
const { VPC_CONNECTOR } = require('./build/config');

exports.api = functions
  .runWith({
    vpcConnector: VPC_CONNECTOR,
    vpcConnectorEgressSettings: 'PRIVATE_RANGES_ONLY',
  })
  .https
  .onRequest(api);
