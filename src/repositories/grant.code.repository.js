const {model} = require('../db/models/grant.code.model');
const BasePostgresRepository = require('./abstracts/base-postgres.repository');

class GrantCodeRepository extends BasePostgresRepository {

  constructor() {
    super(model);
  }
}

module.exports = GrantCodeRepository;
