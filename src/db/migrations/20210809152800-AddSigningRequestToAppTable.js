'use strict';

const DataTypes = require('sequelize/lib/data-types');

module.exports = {
  up: (queryInterface) => {
    return queryInterface.addColumn(
      'apps',
      'signing_request_required',
      {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        onUpdate: 'SET DEFAULT',
        onDelete: 'SET NULL',
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'apps',
      'signing_request_required'
    );
  }
};
