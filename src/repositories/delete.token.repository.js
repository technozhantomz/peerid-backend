const crypto = require('crypto-random-string');
const {model} = require('../db/models/delete.token.model');
const {model: UserModel} = require('../db/models/user.model');
const BasePostgresRepository = require('./abstracts/base-postgres.repository');
const {Op} = require('sequelize');
const moment = require('moment');

class DeleteTokenRepository extends BasePostgresRepository {

  constructor() {
    super(model);
  }

  async createToken(userId, appId) {
    const tokenExists = await this.model.findOne({
      where: {
        isActive: true,
        user_id: userId,
        app_id: appId
      }
    });

    if(tokenExists) {
      return tokenExists;
    }

    return this.model.create({
      user_id: userId,
      app_id: appId,
      token: crypto({length: 26})
    });
  }

  async findActive(token) {
    return this.model.findOne({
      where: {
        isActive: true,
        token,
        createdAt:{
          [Op.gte]: moment(new Date()).subtract(10, 'minutes')
        }
      },
      include: {model: UserModel, required: true}
    });
  }

}

module.exports = DeleteTokenRepository;
