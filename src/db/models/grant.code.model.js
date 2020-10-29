const Sequelize = require('sequelize');
const uid = require('uid2');
const {Model} = Sequelize;

/**
 * @typedef {Class} GrantCodeModel
 * @property {Number} id
 * @property {String} code
 * @property {Array(Number)} scope
 * @property {Boolean} active
 * @property {Number} app_id
 * @property {Number} user_id
 */
class GrantCodeModel extends Model {
  /**
   * @swagger
   *
   * definitions:
   *  GrantCode:
   *    type: object
   *    required:
   *    - code
   *    - scope
   *    - active
   *    - app_id
   *    - user_id
   *    properties:
   *      id:
   *        type: integer
   *        example: 1
   *      code:
   *        type: string
   *        example: 2kj2un2u-22nnj-m2n2n-6edu3he
   *      scope:
   *        type: array
   *        items:
   *          type: integer
   *        example: [0, 25, 46]
   *      active:
   *        type: boolean
   *        example: true
   *      app_id:
   *        type: integer
   *        example: 2
   *      user_id:
   *        type: integer
   *        example: 24
   *  GrantCodes:
   *    type: array
   *    items:
   *      $ref: '#/definitions/GrantCode'
   */
}
const attributes = {
  code: {
    type: Sequelize.STRING,
    unique: true,
    defaultValue: function() {
      return uid(24);
    }
  },
  scope: {
    type: Sequelize.ARRAY(Sequelize.INTEGER)
  },
  active: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  }
};

module.exports = {
  init: (sequelize) => {
    GrantCodeModel.init(attributes, {
      sequelize,
      modelName: 'grantcodes'
    });
  },
  associate: (models) => {
    GrantCodeModel.belongsTo(models.App.model, {foreignKey : 'app_id', targetKey: 'id'});
    GrantCodeModel.belongsTo(models.User.model, {foreignKey : 'user_id', targetKey: 'id'});
  },
  get model() {
    return GrantCodeModel;
  }
};
