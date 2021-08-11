const Sequelize = require('sequelize');
const {Model} = Sequelize;

class TransactionTokenModel extends Model {
  /**
   * @swagger
   *
   * definitions:
   *  TransactionToken:
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
   *      transaction:
   *        type: string
   *        example: { operations: [[1, {to: jotprabh1, from: nathan}]]}
   *      user_id:
   *        type: integer
   *        example: 24
   *      app_id:
   *        type: integer
   *        example: 9
   */
}

module.exports = {
  init: (sequelize) => {
    TransactionTokenModel.init({
      token: {
        type: Sequelize.STRING,
        unique: true
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      transaction: {
        type: Sequelize.STRING,
        allowNull: false
      }
    }, {
      sequelize,
      modelName: 'transaction-tokens'
    });
  },
  associate: (models) => {
    TransactionTokenModel.belongsTo(models.User.model);
    TransactionTokenModel.belongsTo(models.App.model);
  },
  get model() {
    return TransactionTokenModel;
  }
};
