'use strict';

const DataTypes = require('sequelize/lib/data-types');

module.exports = {
  up: (queryInterface) => {
    return queryInterface.addColumn(
      'users',
      'mobile',
      {
        type: DataTypes.STRING,
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'users',
      'mobile'
    );
  }
};
