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
