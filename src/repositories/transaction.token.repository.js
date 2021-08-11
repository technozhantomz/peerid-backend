const crypto = require('crypto-random-string');
const {model} = require('../db/models/transaction.token.model');
const {model: UserModel} = require('../db/models/user.model');
const BasePostgresRepository = require('./abstracts/base-postgres.repository');

class TransactionTokenRepository extends BasePostgresRepository {

  constructor() {
    super(model);
  }

  async createToken(userId, appId, transaction) {
    return this.model.create({
      userId,
      appId,
      token: crypto({length: 26}),
      transaction
    });
  }

  async findActive(token) {
    return this.model.findOne({
      where: {
        isActive: true,
        token
      },
      include: {model: UserModel, required: true}
    });
  }

}

module.exports = TransactionTokenRepository;
