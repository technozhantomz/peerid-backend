const {model} = require('../db/models/app.model');
const BasePostgresRepository = require('./abstracts/base-postgres.repository');

class AppRepository extends BasePostgresRepository {

  constructor() {
    super(model);
  }
}

module.exports = AppRepository;
