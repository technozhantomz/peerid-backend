const Sequelize = require('sequelize');
const {Model} = Sequelize;

/**
 * @typedef {Class} OperationModel
 * @property {Number} id
 * @property {Number} operation_requested
 * @property {Number} app_id
 */
class OperationModel extends Model {
  /**
   * @swagger
   *
   * definitions:
   *  Operation:
   *    type: object
   *    required:
   *    - operation_requested
   *    - app_id
   *    properties:
   *      id:
   *        type: integer
   *        example: 1
   *      operation_requested:
   *        type: integer
   *        example: 35
   *      app_id:
   *        type: integer
   *        example: 2
   *  Operations:
   *    type: array
   *    items:
   *      $ref: '#/definitions/Operation'
   */
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
