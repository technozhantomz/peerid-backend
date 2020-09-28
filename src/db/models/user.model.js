const Sequelize = require('sequelize');
const {Model} = Sequelize;

class UserModel extends Model {
  /**
   * @swagger
   *
   * definitions:
   *  UserNew:
   *    type: object
   *    properties:
   *      facebook:
   *        type: string
   *      peerplaysAccountName:
   *        type: string
   *      email:
   *        type: string
   *
   *  User:
   *    allOf:
   *      - $ref: '#/definitions/UserNew'
   *      - type: object
   *        properties:
   *          id:
   *            type: integer
   *          username:
   *            type: string
   *          googleName:
   *            type: string
   *
   * @returns {UserPublicObject}
   */
  getPublic() {
    return {
      id: this.id,
      username: this.username || '',
      email: this.email || '',
      googleName: this.googleName,
      facebook: this.facebook,
      peerplaysAccountName: this.peerplaysAccountName,
      peerplaysAccountId: this.peerplaysAccountId
    };
  }

  getPublicMinimal() {
    return {
      id: this.id,
      username: this.username || '',
      peerplaysAccountName: this.peerplaysAccountName
    };
  }
}
const attributes = {
  username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: true
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: true
  },
  isEmailVerified: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  password: {type: Sequelize.STRING},
  googleId: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: true
  },
  facebookId: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: true
  },
  googleName: {
    type: Sequelize.STRING
  },
  facebook: {
    type: Sequelize.STRING,
    defaultValue: ''
  },
  peerplaysAccountName: {
    type: Sequelize.STRING,
    defaultValue: ''
  },
  peerplaysAccountId: {
    type: Sequelize.STRING,
    defaultValue: ''
  }
};

module.exports = {
  init: (sequelize) => {
    UserModel.init(attributes, {
      sequelize,
      modelName: 'users'
    });
  },
  associate: (models) => {
    UserModel.hasMany(models.ResetToken.model);
  },
  get model() {
    return UserModel;
  }
};
