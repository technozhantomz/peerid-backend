const {model} = require('../db/models/permission.model');
const BasePostgresRepository = require('./abstracts/base-postgres.repository');

class PermissionRepository extends BasePostgresRepository {

  constructor() {
    super(model);
  }

}

module.exports = PermissionRepository;