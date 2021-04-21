const Sequelize = require('sequelize');

const {model} = require('../db/models/user.model');
const BasePostgresRepository = require('./abstracts/base-postgres.repository');

class UserRepository extends BasePostgresRepository {

  constructor() {
    super(model);
  }

  async findAll() {
    return this.model.findAll();
  }

  /**
   * @param ids
   * @returns {Promise<UserModel[]>}
   */
  async findByPkList(ids) {
    return this.model.findAll({
      where: {
        id: {[Sequelize.Op.in]: ids}
      }
    });
  }

  async getByLogin(login) {
    return this.model.findOne({
      where: {
        [Sequelize.Op.or]: [{
          email: login.toLowerCase()
        }, {
          username: login
        }]
      }
    });
  }

  async searchUsers(search, limit, offset) {
    const filter = search ? {
      username: {
        [Sequelize.Op.like]: `%${search}%`
      }
    } : null;
    return this.model.findAll({
      where: filter,
      offset,
      limit
    });
  }

  async getUserInfo(userId) {
    const userInfo = await this.model.findOne({
      where: {
        id: userId
      },
      attributes: ['username', 'email', 'peerplaysAccountName', 'facebook']
    });

    return userInfo;
  }

  async getByEmailOrUsername(email, username) {
    return this.model.findOne({
      where: {[Sequelize.Op.or]: [{email}, {username}]}
    });
  }

  normalizePhoneNumber(mobile) {
    if(!mobile) {
      return mobile;
    }

    var number = mobile;
    number = number.replace(/[^\d+]+/g, '');
    number = number.replace(/^00/, '+');

    if (number.match(/^1/)) { 
      number = '+' + number;
    }

    if (!number.match(/^\+/)) {
      number = '+1' + number;
    }

    return number;
  }

  async setAccountId(userId, accountId) {
    return this.model.update(
      {peerplaysAccountId: accountId},
      {where: {id: userId}}
    );
  }

  async setPeerplaysAccountId(userId, accountId) {
    return await this.model.update(
      {peerplaysAccountId: accountId},
      {where: {id: userId}}
    );
  }

  async getByPeerplaysAccountName(accountName) {
    return this.model.findOne({
      where: {
        peerplaysAccountName: accountName
      }
    });
  }

}

module.exports = UserRepository;
