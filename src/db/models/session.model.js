const Sequelize = require('sequelize');
const {Model} = Sequelize;

class SessionModel extends Model {}

module.exports = {
  init: (sequelize) => {
    SessionModel.init({
      sid: {
        type: Sequelize.STRING(36),
        unique: true,
        defaultValue: true
      },
      expires: {
        type: Sequelize.DATE
      },
      data: {
        type: Sequelize.TEXT
      }
    }, {
      sequelize,
      modelName: 'Sessions'
    });
  },
  associate: (models) => {
    SessionModel.belongsTo(models.User.model, {foreignKey: 'userId', targetKey: 'id'});
  },
  get model() {
    return SessionModel;
  }
};
