'use strict';

const MigrationUtil = require('../../utils/migtation.util');
const DataTypes = require('sequelize/lib/data-types');

const fields = {
  ...MigrationUtil.genericRows(),
  username: {type: DataTypes.STRING, unique: true, allowNull: true,},
  email: {type: DataTypes.STRING, unique: true, allowNull: true,},
  isEmailVerified: {type: DataTypes.BOOLEAN, defaultValue: false,},
  password: {type: DataTypes.STRING},
  googleId: {type: DataTypes.STRING, unique: true, allowNull: true,},
  facebookId: {type: DataTypes.STRING, unique: true, allowNull: true,},
  googleName: {type: DataTypes.STRING,},
  facebook: {type: DataTypes.STRING, defaultValue: '',},
  peerplaysAccountName: {type: DataTypes.STRING, defaultValue: '',},
  peerplaysAccountId: {type: DataTypes.STRING, defaultValue: '',}
};

module.exports = {
  up: (queryInterface) => {
    return queryInterface.createTable('users', fields);
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('users');
  },
};
