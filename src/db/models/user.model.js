const Sequelize = require('sequelize');
const {Model} = Sequelize;

class UserModel extends Model {
/**
   * @swagger
   *
   * definitions:
   *  User:
   *    type: object
   *    required:
   *    - email
   *    properties:
   *      password:
   *        type: string
   *        example: p@ssw0rd9999
   *        minLength: 6
   *        maxLength: 30
   *        format: password
   *        pattern: '^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$'
   *      username:
   *        type: string
   *        example: prabhjot
   *      email:
   *        type: string
   *        format: email
   *        example: p.singh@gmail.com
   *      mobile:
   *        type: string
   *        example: +1 (999) 999-9999
   *      isEmailVerified:
   *        type: boolean
   *      googleId:
   *        type: string
   *        example: 1028028728
   *      facebookId:
   *        type: string
   *        example: 20837928638
   *      googleName:
   *        type: string
   *        example: prabhjot30
   *      facebook:
   *        type: string
   *        example: 87289492892
   *      peerplaysAccountName:
   *        type: string
   *        example: pi-kdijen0j3mi
   *      peerplaysAccountId:
   *        type: string
   *        example: 1.2.40
   *
   *  UserPublic:
   *    type: object
   *    properties:
   *      id:
   *        type: integer
   *      username:
   *        type: string
   *        example: prabhjot
   *      email:
   *        type: string
   *        format: email
   *        example: p.singh@gmail.com
   *      mobile:
   *        type: string
   *        example: +1 (999) 999-9999
   *      googleName:
   *        type: string
   *        example: prabhjot30
   *      facebook:
   *        type: string
   *        example: 87289492892
   *      peerplaysAccountName:
   *        type: string
   *        example: pi-kdijen0j3mi
   *      peerplaysAccountId:
   *        type: string
   *        example: 1.2.40
   *
   * @returns {UserPublicObject}
   */
  getPublic() {
    return {
      id: this.id,
      username: this.username || '',
      email: this.email || '',
      mobile: this.mobile || '',
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
  mobile: {
    type: Sequelize.STRING,
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
  discordId: {
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
  discordName: {
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
