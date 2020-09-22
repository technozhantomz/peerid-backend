const Joi = require('./abstract/joi.form');
const BaseValidator = require('./abstract/base.validator');

class ProfileValidator extends BaseValidator {
  constructor() {
    super();

    this.createPeerplaysAccount = this.createPeerplaysAccount.bind(this);
  }

  createPeerplaysAccount() {
    const bodySchema = {
      name: Joi.string().required().min(3).max(254),
      ownerKey: Joi.string().required().min(53).max(54),
      activeKey: Joi.string().required().min(53).max(54)
    };

    return this.validate(null, bodySchema, (req, query, body) => body);
  }

}

module.exports = ProfileValidator;
