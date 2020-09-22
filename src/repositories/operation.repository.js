const {model} = require('../db/models/operation.model');
const BasePostgresRepository = require('./abstracts/base-postgres.repository');

class OperationRepository extends BasePostgresRepository {

  constructor() {
    super(model);
  }
}

module.exports = OperationRepository;
