'use strict';

const MigrationUtil = require('../../utils/migtation.util');
const DataTypes = require('sequelize/lib/data-types');

const fields = {
  ...MigrationUtil.genericRows(),
  ...MigrationUtil.createForeignFields(['user_id','app_id','permission_id']),
  peerplays_permission_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  peerplays_account_auth_id: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  operation: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  expiry: {
    type: DataTypes.DATE,
    allowNull: false
  }
};

module.exports = {
  up: (queryInterface) => {
    return queryInterface.createTable('authorities', fields);
  },

  down: (queryInterface) => {

    return queryInterface.dropTable('authorities');
  },
};
