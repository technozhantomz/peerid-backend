const Sequelize = require('sequelize');
const {Model} = Sequelize;

class ResetTokenModel extends Model {

  async deactivate() {
    this.isActive = false;
    await this.save();
  }

}

module.exports = {
  init: (sequelize) => {
    ResetTokenModel.init({
      token: {
        type: Sequelize.STRING,
        unique: true
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      }
    }, {
      sequelize,
      modelName: 'reset-tokens'
    });
  },
  associate: (models) => {
    ResetTokenModel.belongsTo(models.User.model);
  },
  get model() {
    return ResetTokenModel;
  }
};
