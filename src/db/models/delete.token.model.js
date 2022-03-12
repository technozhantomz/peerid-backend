const Sequelize = require('sequelize');
const {Model} = Sequelize;

class DeleteTokenModel extends Model {
  /**
   * @swagger
   *
   * definitions:
   *  DeleteToken:
   *    type: object
   *    required:
   *    - token
   *    - isActive
   *    - user_id
   *    - app_id
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
   *      app_id
   *        type: integer
   *        example: 9
   */
  async deactivate() {
    this.isActive = false;
    await this.save();
  }

}

module.exports = {
  init: (sequelize) => {
    DeleteTokenModel.init({
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
      modelName: 'delete-tokens'
    });
  },
  associate: (models) => {
    DeleteTokenModel.belongsTo(models.User.model, {foreignKey: 'user_id', targetKey: 'id'});
    DeleteTokenModel.belongsTo(models.App.model, {foreignKey: 'app_id', targetKey: 'id'});
  },
  get model() {
    return DeleteTokenModel;
  }
};
