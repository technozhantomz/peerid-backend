const Sequelize = require('sequelize');
const {Model} = Sequelize;

class VerificationTokenModel extends Model {
  /**
   * @swagger
   *
   * definitions:
   *  VerificationToken:
   *    type: object
   *    required:
   *    - token
   *    - isActive
   *    - email
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
   *      email:
   *        type: string
   *        format: email
   *        example: abc@abc.com
   *      user_id:
   *        type: integer
   *        example: 24
   */
}

module.exports = {
  init: (sequelize) => {
    VerificationTokenModel.init({
      token: {
        type: Sequelize.STRING,
        unique: true
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      email: {
        type: Sequelize.STRING,
        defaultValue: ''
      }
    }, {
      sequelize,
      modelName: 'verification-tokens'
    });
  },
  associate: (models) => {
    VerificationTokenModel.belongsTo(models.User.model, {foreignKey: 'user_id', targetKey: 'id'});
  },
  get model() {
    return VerificationTokenModel;
  }
};
