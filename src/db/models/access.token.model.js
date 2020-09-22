const Sequelize = require('sequelize');
const uid = require('uid2');
const {Model} = Sequelize;

/**
 * @typedef {Class} AccessTokenModel
 * @property {Number} id
 * @property {String} token
 * @property {Array(Number)} scope
 * @property {Date} expires
 * @property {Number} app_id
 * @property {Number} user_id
 * @property {Number} grantcode_id
 */
class AccessTokenModel extends Model {

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
