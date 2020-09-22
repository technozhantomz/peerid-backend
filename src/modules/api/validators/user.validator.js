const Joi = require('./abstract/joi.form');
const BaseValidator = require('./abstract/base.validator');

class UserValidator extends BaseValidator {
  constructor() {
    super();
    this.getUser = this.getUser.bind(this);
    this.getUsers = this.getUsers.bind(this);
  }

  getUser() {
    const querySchema = {
      id: Joi.number().integer().required()
    };

    return this.validate(querySchema, null, (req, query) => query.id);
  }

  getUsers() {
    const querySchema = {
      search: Joi.string().regex(/^[a-zA-Z0-9.-]+$/).allow('').max(254),
      limit: Joi.number().required().min(1).max(100).default(20),
      skip: Joi.number().integer().min(0).default(0)
    };

    return this.validate(querySchema, null, (req, query) => query);
  }

}

module.exports = UserValidator;
