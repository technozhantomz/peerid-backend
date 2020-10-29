const Sequelize = require('sequelize');
const {Model} = Sequelize;

class ResetTokenModel extends Model {
  /**
   * @swagger
   *
   * definitions:
   *  ResetToken:
   *    type: object
   *    required:
   *    - token
   *    - isActive
   *    - user_id
   *    properties:
   *      id:
   *        type: integer
   *        example: 1
   *      token:
   *        type: string
   *        example: 2kj2un2u-22nnj-m2n2n-6edu3he
   *      isActive:
   *        type: boolean
   *        example: true
   *      user_id:
   *        type: integer
   *        example: 24
   */
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
