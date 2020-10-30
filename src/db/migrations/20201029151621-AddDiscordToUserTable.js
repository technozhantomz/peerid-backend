'use strict';

const DataTypes = require('sequelize/lib/data-types');

module.exports = {
  up: (queryInterface) => {
    return Promise.all([
      queryInterface.addColumn(
        'users',
        'discordId',
        {
          type: DataTypes.STRING,
          unique: true,
          allowNull: true,
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        }
      ),
      queryInterface.addColumn(
        'users',
        'discordName',
        {
          type: DataTypes.STRING,
          defaultValue: '',
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        }
      )
    ]);
  },

  down: (queryInterface) => {
    return Promise.all([
      queryInterface.removeColumn(
        'users',
        'discordId'
      ),
      queryInterface.removeColumn(
        'users',
        'discordName'
      )
    ]);
  }
};
