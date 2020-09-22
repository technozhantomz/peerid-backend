const Sequelize = require('sequelize');
const {Model} = Sequelize;

/**
 * @typedef {Class} PermissionModel
 * @property {Number} id
 * @property {String} peerplays_permission_id
 * @property {Number} user_id
 */
class PermissionModel extends Model {

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
