'use strict';
const DataTypes = require('sequelize/lib/data-types');
const MigrationUtil = require('../../utils/migtation.util');
const fields = {
  ...MigrationUtil.genericRows(),
  ...MigrationUtil.createForeignFields(['userId']),
  ...MigrationUtil.createForeignFields(['appId']),
  token: {type: DataTypes.STRING, unique: true},
  isActive: {type: DataTypes.BOOLEAN, defaultValue: true}
};

module.exports = {
  up: (queryInterface) => {
    return queryInterface.createTable('delete-tokens', fields);
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('delete-tokens');
  }
};
