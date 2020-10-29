'use strict';

const DataTypes = require('sequelize/lib/data-types');

module.exports = {
  up: (queryInterface) => {
    return queryInterface.addColumn(
      'accesstokens',
      'refresh_token',
      {
        type: DataTypes.STRING,
        unique: true,
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    );
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn(
      'accesstokens',
      'refresh_token'
    );
  }
};
