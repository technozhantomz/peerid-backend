const Sequelize = require('sequelize');
const {Model} = Sequelize;

/**
 * @typedef {Class} PermissionModel
 * @property {Number} id
 * @property {String} peerplays_permission_id
 * @property {Number} user_id
 */
class PermissionModel extends Model {
  /**
   * @swagger
   *
   * definitions:
   *  Permission:
   *    type: object
   *    required:
   *    - peerplays_permission_id
   *    - permission_name
   *    - peerplays_account_id
   *    - user_id
   *    properties:
   *      id:
   *        type: integer
   *        example: 1
   *      peerplays_permission_id:
   *        type: string
   *        example: 1.27.35
   *      permission_name:
   *        type: string
   *        example: pidimdebnosw
   *      peerplays_account_id:
   *        type: string
   *        example: 1.2.40
   *      user_id:
   *        type: integer
   *        example: 24
   *  Permissions:
   *    type: array
   *    items:
   *      $ref: '#/definitions/Permission'
   */
}
const attributes = {
  peerplays_permission_id: {
    type: Sequelize.STRING,
    allowNull: false
  },
  permission_name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  peerplays_account_id: {
    type: Sequelize.STRING,
    allowNull: false
  },
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
};

module.exports = {
  init: (sequelize) => {
    PermissionModel.init(attributes, {
      sequelize,
      modelName: 'permissions'
    });
  },
  associate: (models) => {
    PermissionModel.belongsTo(models.User.model, {foreignKey : 'user_id', targetKey: 'id'});
  },
  get model() {
    return PermissionModel;
  }
};
