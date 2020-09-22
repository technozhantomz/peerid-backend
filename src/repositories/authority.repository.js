const {model} = require('../db/models/authority.model');
const BasePostgresRepository = require('./abstracts/base-postgres.repository');

class AuthorityRepository extends BasePostgresRepository {

  constructor() {
    super(model);
  }

}

module.exports = AuthorityRepository;