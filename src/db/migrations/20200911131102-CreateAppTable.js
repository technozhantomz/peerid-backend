'use strict';

const MigrationUtil = require('../../utils/migtation.util');
const DataTypes = require('sequelize/lib/data-types');

const fields = {
  ...MigrationUtil.genericRows(),
  ...MigrationUtil.createForeignFields(['registrar_id']),
  appname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  organization_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false
  },
  province: {
    type: DataTypes.STRING,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contactname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address_line1: {
    type: DataTypes.STRING, 
    allowNull: false
  },
  address_line2: {
    type: DataTypes.STRING
  },
  postal_code: {
    type: DataTypes.STRING
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  domains: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false
  },
  app_secret: {
    type: DataTypes.STRING,
    unique: true,
    defaultValue: function() {
      return uid(42);
    }
  },
};

module.exports = {
  up: (queryInterface) => {
    return queryInterface.createTable('apps', fields);
  },

  down: (queryInterface) => {

    return queryInterface.dropTable('apps');
  },
};
