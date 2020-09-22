'use strict';

const MigrationUtil = require('../../utils/migtation.util');
const DataTypes = require('sequelize/lib/data-types');

const fields = {
  ...MigrationUtil.genericRows(),
  ...MigrationUtil.createForeignFields(['app_id','user_id']),
  code: {
    type: DataTypes.STRING,
    unique: true
  },
  scope: {
    type: DataTypes.ARRAY(DataTypes.INTEGER)
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
};

module.exports = {
  up: (queryInterface) => {
    return queryInterface.createTable('grantcodes', fields);
  },

  down: (queryInterface) => {

    return queryInterface.dropTable('grantcodes');
  },
};
