'use strict';
const DataTypes = require('sequelize/lib/data-types');
const MigrationUtil = require('../../utils/migtation.util');
const fields = {
  ...MigrationUtil.genericRows(),
  ...MigrationUtil.createForeignFields(['app_id']),
  operation_requested: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
};

module.exports = {
  up: (queryInterface) => {
    return queryInterface.createTable('operations', fields)
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('operations');
  }
};
