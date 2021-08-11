'use strict';
const DataTypes = require('sequelize/lib/data-types');
const MigrationUtil = require('../../utils/migtation.util');
const fields = {
  ...MigrationUtil.genericRows(),
  ...MigrationUtil.createForeignFields(['userId']),
  ...MigrationUtil.createForeignFields(['appId']),
  token: {type: DataTypes.STRING, unique: true},
  transaction: {type: DataTypes.STRING},
  isActive: {type: DataTypes.BOOLEAN, defaultValue: true}
};

module.exports = {
  up: (queryInterface) => {
    return queryInterface.createTable('transaction-tokens', fields);
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('transaction-tokens');
  }
};
