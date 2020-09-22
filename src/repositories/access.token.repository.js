const {model} = require('../db/models/access.token.model');
const BasePostgresRepository = require('./abstracts/base-postgres.repository');

class AccessTokenRepository extends BasePostgresRepository {

  constructor() {
    super(model);
  }
}

module.exports = AccessTokenRepository;
