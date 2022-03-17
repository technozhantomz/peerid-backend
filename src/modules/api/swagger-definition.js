const config = require('config');

module.exports = {
  info: {
    title: 'PeerID',
    version: '1',
    description: 'APIs for PeerID'
  },
  host: config.swagger.host,
  apis: [
    'src/errors/*.js',
    'src/modules/api/controllers/*.js',
    'src/modules/api/validators/*.js',
    'src/modules/api/validators/abstract/*.js',
    'src/modules/api/api.module.js',
    'src/db/models/*.js'
  ],
  basePath: '/api/v1',
  schemes: config.swagger.schemes
};
