'use strict';

const MigrationUtil = require('../../utils/migtation.util');
const DataTypes = require('sequelize/lib/data-types');

const fields = {
  ...MigrationUtil.genericRows(),
  ...MigrationUtil.createForeignFields(['app_id', 'user_id', 'grantcode_id']),
  token: {
    type: DataTypes.STRING,
    unique: true
  },
  scope: {
    type: DataTypes.ARRAY(DataTypes.INTEGER)
  },
  expires: {
    type: DataTypes.DATE
  }
};

module.exports = {
  up: (queryInterface) => {
    return queryInterface.createTable('accesstokens', fields);
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('accesstokens');
  },
};
