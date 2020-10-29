const Joi = require('joi');
const { ChainTypes } = require('peerplaysjs-lib');
const BaseValidator = require('./abstract/base.validator');
const ValidateError = require('../../../errors/validate.error');
const url = require('url');
const psl = require('psl');

class AppValidator extends BaseValidator {
  /**
   * @param {AppRepository} opts.appRepository
   */
  constructor(opts) {
    super();

    this.appRepository = opts.appRepository;
    this.permissionRepository = opts.permissionRepository;
    this.accessTokenRepository = opts.accessTokenRepository;
    this.operationRepository = opts.operationRepository;

    this.registerApp = this.registerApp.bind(this);
    this.deleteApp = this.deleteApp.bind(this);
    this.validateTransaction = this.validateTransaction.bind(this);
    this.joinApp = this.joinApp.bind(this);
    this.getAppOperations = this.getAppOperations.bind(this);
    this.unjoinApp = this.unjoinApp.bind(this);
  }

  registerApp() {
    const bodySchema = {
      id: Joi.number().integer().optional(),
      appname: Joi.string().min(3).max(255).required(),
      email: Joi.string().email().required(),
      description: Joi.string().min(5).max(1000).required(),
      organization_name: Joi.string().min(2).max(255).required(),
      country: Joi.string().min(2).max(100).required(),
      province: Joi.string().min(2).max(100).required(),
      city: Joi.string().min(2).max(100).required(),
      address_line1: Joi.string().min(5).max(255).required(),
      address_line2: Joi.string().max(255).optional(),
      postal_code: Joi.string().max(20).optional(),
      contactname: Joi.string().min(2).max(255).required(),
      phone: Joi.string().regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/).required(),
      domains: Joi.array().items(Joi.string()).required(),
      operations: Joi.array().items(Joi.number().integer().min(0).max(100)).required()
    };
    
    return this.validate(null, bodySchema, async (req, query, body) => {
      const {appname} = body;
      const AppNameExists = await this.appRepository.model.findOne({
        where: {
          appname
        }
      });

      if(AppNameExists && !body.hasOwnProperty('id')) {
        throw new ValidateError(400, 'Validate error', {
          appname: 'Appname already exits'
        });
      }

      if(body.hasOwnProperty('id')) {
        const AppIdExists = await this.appRepository.findByPk(body.id);
        if(!AppIdExists) {
          throw new ValidateError(400, 'Validate error', {
            id: 'App not found'
          });
        }
      }

      return body;
    });
  }

  deleteApp() {
    const querySchema = {
      id: Joi.number().integer().required()
    };

    return this.validate(querySchema, null, async (req, query) => {
      const {id} = query;

      const AppExists = await this.appRepository.model.findOne({
        where: {
          id
        }
      });

      if(!AppExists) {
        throw new ValidateError(400, 'Validate error', {
          id: 'App does not exist'
        });
      }

      return AppExists;
    });
  }

  validateTransaction() {
    const bodySchema = {
      transaction: Joi.object().keys({
        ref_block_num: Joi.number().required(),
        ref_block_prefix: Joi.number().required(),
        expiration: Joi.string().required(),
        operations: Joi.array().min(1).items(Joi.array().length(2).items(Joi.number().integer(), Joi.object())).required(),
        extensions: Joi.array().optional(),
        signatures: Joi.array().required()
      }).required()
    };

    return this.validate(null, bodySchema, async (req, query, body) => {
      const {transaction} = body;

      const authHeader = req.headers['Authorization'].split(' ')[1];
      const AccessToken = await this.accessTokenRepository.model.findOne({
        where: {
          token: authHeader
        }
      });

      const Ops = await this.operationRepository.model.findAll({
        where: {app_id: AccessToken.app_id}
      });
  
      const OpsArr = Ops.map(({operation_requested}) => operation_requested);

      const allOpsExist = transaction.operations.every((op) => OpsArr.indexOf(op[0]) >= 0);

      if(!allOpsExist) {
        throw new ValidateError('400', 'operations invalid');
      }

      return transaction;
    });
  }

  joinApp() {
    const bodySchema = {
      client_id: Joi.number().integer().required(),
      redirect_uri: Joi.string().uri().required()
    };

    return this.validate(null, bodySchema, async (req, query, body) => {
      let {client_id, redirect_uri} = body;

      const Permission = await this.permissionRepository.model.findOne({where: { user_id: req.user.id }});
      if(!Permission) {
        throw new ValidateError(401, 'Unauthorized', {
          user: 'Permission does not exist for this user'
        });
      }

      //validate client id
      const AppExists = await this.appRepository.model.findOne({
        where: {
          id: client_id
        }
      });

      if(!AppExists) {
        throw new ValidateError(400, 'Validate error', {
          client_id: 'App does not exist'
        });
      }

      // validate redirect_uri
      let match = false, uri = new url.URL(redirect_uri);
      let domain = psl.parse(uri.hostname).domain.toLowerCase();

      for (let i = 0; i < AppExists.domains.length; i++) {
        if (domain === AppExists.domains[i].toLowerCase()) {
          match = true;
          break;
        }
      }

      if(!match) {
        throw new ValidateError(400, 'Validate error', {
          redirect_uri: 'You must supply a redirect_uri that is a domain or url scheme owned by your app'
        });
      }

      return AppExists;
    });
  }

  unjoinApp() {
    const bodySchema = {
      app_id: Joi.number().integer().required()
    };

    return this.validate(null, bodySchema, async (req, query, body) => {
      let {app_id} = body;

      //validate client id
      const AppExists = await this.appRepository.model.findOne({
        where: {
          id: app_id
        }
      });

      if(!AppExists) {
        throw new ValidateError(400, 'Validate error', {
          app_id: 'App does not exist'
        });
      }

      return { app: AppExists };
    });
  }

  getAppOperations() {
    const querySchema = {
      id: Joi.number().integer().required()
    };

    return this.validate(querySchema, null, async (req, query) => {
      const {id} = query;

      const AppExists = await this.appRepository.model.findOne({
        where: {
          id
        }
      });

      if(!AppExists) {
        throw new ValidateError(400, 'Validate error', {
          id: 'App does not exist'
        });
      }

      return id;
    });
  }
}

module.exports = AppValidator;