const Sequelize = require('sequelize');
const {Model} = Sequelize;

/**
 * @typedef {Class} OperationModel
 * @property {Number} id
 * @property {Number} operation_requested
 * @property {Number} app_id
 */
class OperationModel extends Model {

}
const attributes = {
  operation_requested: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  app_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
};

module.exports = {
  init: (sequelize) => {
    OperationModel.init(attributes, {
      sequelize,
      modelName: 'operations'
    });
  },
  associate: (models) => {
    OperationModel.belongsTo(models.App.model, {foreignKey : 'app_id', targetKey: 'id'});
  },
  get model() {
    return OperationModel;
  }
};
