const Sequelize = require('sequelize');
const uid = require('uid2');
const {Model} = Sequelize;

/**
 * @typedef {Class} AccessTokenModel
 * @property {Number} id
 * @property {String} token
 * @property {Array(Number)} scope
 * @property {Date} expires
 * @property {String} refresh_token
 * @property {Number} app_id
 * @property {Number} user_id
 * @property {Number} grantcode_id
 */
class AccessTokenModel extends Model {
  /**
   * @swagger
   *
   * definitions:
   *  AccessToken:
   *    type: object
   *    required:
   *    - token
   *    - scope
   *    - expires
   *    - refresh_token
   *    - app_id
   *    - user_id
   *    - grantcode_id
   *    properties:
   *      id:
   *        type: integer
   *        example: 1
   *      token:
   *        type: string
   *        format: uuid
   *        example: 2kj2un2u-22nnj-m2n2n-6edu3he
   *      scope:
   *        type: array
   *        items:
   *          type: integer
   *        example: [33,45]
   *      expires:
   *        type: string
   *        format: date
   *      refresh_token:
   *        type: string
   *        format: uuid
   *        example: 2kj2un2u-22nnj-m2n2n-6edu3he
   *      app_id:
   *        type: integer
   *        example: 2
   *      user_id:
   *        type: integer
   *        example: 24
   *      grantcode_id:
   *        type: integer
   *        example: 222
   *  AccessTokens:
   *    type: array
   *    items:
   *      $ref: '#/definitions/AccessToken'
   */
}
const attributes = {
  token: {
    type: Sequelize.STRING,
    unique: true,
    defaultValue: function() {
      return uid(124);
    }
  },
  scope: {
    type: Sequelize.ARRAY(Sequelize.INTEGER)
  },
  expires: {
    type: Sequelize.DATE,
    defaultValue: function() {
      var today = new Date();
      var length = 60; // Length (in minutes) of our access token
      return new Date(today.getTime() + length*60000);
    }
  },
  refresh_token: {
    type: Sequelize.STRING,
    unique: true,
    defaultValue: function() {
      return uid(124);
    }
  }
};

module.exports = {
  init: (sequelize) => {
    AccessTokenModel.init(attributes, {
      sequelize,
      modelName: 'accesstokens'
    });
  },
  associate: (models) => {
    AccessTokenModel.belongsTo(models.App.model, {foreignKey : 'app_id', targetKey: 'id'});
    AccessTokenModel.belongsTo(models.User.model, {foreignKey : 'user_id', targetKey: 'id'});
    AccessTokenModel.belongsTo(models.GrantCode.model, {foreignKey : 'grantcode_id', targetKey: 'id'});
  },
  get model() {
    return AccessTokenModel;
  }
};
