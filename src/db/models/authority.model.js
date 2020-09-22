const Sequelize = require('sequelize');
const {Model} = Sequelize;

/**
 * @typedef {Class} AuthorityModel
 * @property {Number} id
 * @property {String} peerplays_permission_id
 * @property {String} peerplays_account_auth_id
 * @property {Number} operation
 * @property {Date} expiry
 * @property {Number} app_id
 * @property {Number} user_id
 * @property {Number} permission_id
 */
class AuthorityModel extends Model {

}
const attributes = {
  peerplays_permission_id: {
    type: Sequelize.STRING,
    allowNull: false
  },
  peerplays_account_auth_id: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  operation: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  expiry: {
    type: Sequelize.DATE,
    allowNull: false
  },
  app_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  permission_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
};

module.exports = {
  init: (sequelize) => {
    AuthorityModel.init(attributes, {
      sequelize,
      modelName: 'authorities'
    });
  },
  associate: (models) => {
    AuthorityModel.belongsTo(models.User.model, {foreignKey : 'user_id', targetKey: 'id'});
    AuthorityModel.belongsTo(models.App.model, {foreignKey : 'app_id', targetKey: 'id'});
    AuthorityModel.belongsTo(models.Permission.model, {foreignKey: 'permission_id', targetKey: 'id'});
  },
  get model() {
    return AuthorityModel;
  }
};
