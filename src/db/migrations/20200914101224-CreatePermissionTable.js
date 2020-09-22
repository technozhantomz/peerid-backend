'use strict';

const MigrationUtil = require('../../utils/migtation.util');
const DataTypes = require('sequelize/lib/data-types');

const fields = {
  ...MigrationUtil.genericRows(),
  ...MigrationUtil.createForeignFields(['user_id']),
  peerplays_permission_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  permission_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  peerplays_account_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
};

module.exports = {
  up: (queryInterface) => {
    return queryInterface.createTable('permissions', fields);
  },

  down: (queryInterface) => {

    return queryInterface.dropTable('permissions');
  },
};
