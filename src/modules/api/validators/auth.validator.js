const Joi = require('./abstract/joi.form');
const tldJS = require('tldjs');
const BaseValidator = require('./abstract/base.validator');
const ValidateError = require('./../../../errors/validate.error');
const tokenConstants = require('../../../constants/token');

class AuthValidator extends BaseValidator {

  /**
   * @param {UserRepository} opts.userRepository
   * @param {AppRepository} opts.appRepository
   * @param {AccessTokenRepository} opts.accessTokenRepository
   * @param {GrantCodeRepository} opts.grantCodeRepository
   * @param {VerificationTokenRepository} opts.verificationTokenRepository
   * @param {ResetTokenRepository} opts.resetTokenRepository
   * @param {PeerplaysRepository} opts.peerplaysRepository
   */
  constructor(opts) {
    super();

    this.appRepository = opts.appRepository;
    this.accessTokenRepository = opts.accessTokenRepository;
    this.grantCodeRepository = opts.grantCodeRepository;
    this.userRepository = opts.userRepository;
    this.verificationTokenRepository = opts.verificationTokenRepository;
    this.resetTokenRepository = opts.resetTokenRepository;
    this.peerplaysRepository = opts.peerplaysRepository;

    this.validateSignUp = this.validateSignUp.bind(this);
    this.validateConfirmEmail = this.validateConfirmEmail.bind(this);
    this.validateSignIn = this.validateSignIn.bind(this);
    this.validateForgotPassword = this.validateForgotPassword.bind(this);
    this.validateResetPassword = this.validateResetPassword.bind(this);
    this.loggedOnly = this.loggedOnly.bind(this);
    this.validatePeerplaysLogin = this.validatePeerplaysLogin.bind(this);
    this.validateCode = this.validateCode.bind(this);
    this.validateAccessToken = this.validateAccessToken.bind(this);
  }

  loggedOnly() {
    return this.validate(null, null, async (req) => {

      if (!req.isAuthenticated()) {
        throw new ValidateError(401, 'unauthorized');
      }

      return null;
    });
  }

  validateSignUp() {
    const bodySchema = {
      email: Joi.string().email().required(),
      username: Joi.string().regex(/^[a-z][a-z0-9-]+[a-z0-9]$/).min(3).max(60).required(),
      password: Joi.string().regex(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])[a-zA-Z0-9!@#\$%\^&\*]+$/).min(6).max(60).required()
    };

    return this.validate(null, bodySchema, async (req, query, body) => {
      const {username, password, email} = body;

      if (username.match(/-dividend-distribution/)) {
        throw new ValidateError(400, 'Validate error', {
          username: 'Should not include "-dividend-distribution"'
        });
      }

      if (email.match(/@.+\..+/) && (!tldJS.tldExists(email) || (email.split('@').pop().split('.').length > 2))) {
        throw new ValidateError(400, 'Validate error', {
          email: 'Invalid email'
        });
      }

      const alreadyExists = await this.userRepository.getByEmailOrUsername(email.toLowerCase(), username);

      if (alreadyExists && alreadyExists.email === email.toLowerCase()) {
        throw new ValidateError(400, 'Validate error', {
          email: 'This email is already used'
        });
      }

      if (alreadyExists && alreadyExists.username === username) {
        throw new ValidateError(400, 'Validate error', {
          username: 'This username is already used'
        });
      }

      const peerplaysUser = await this.peerplaysRepository.getAccountId(`se-${username}`);

      if(peerplaysUser!=null) {
        throw new ValidateError(400,'Validate error', {
          username: `Peerplays account exists with the username se-${username}`
        });
      }

      return {email, password, username};
    });
  }

  validateConfirmEmail() {
    const querySchema = {
      token: Joi.string().required()
    };
    return this.validate(querySchema, null, async (req, query) => {

      const {token} = query;

      const ActiveToken = await this.verificationTokenRepository.findActive(token);

      if (!ActiveToken) {
        throw new ValidateError(404, tokenConstants.tokenNotFound);
      }

      return ActiveToken;
    });
  }

  validateSignIn() {
    const bodySchema = {
      login: Joi.string().required(),
      password: Joi.string().required()
    };

    return this.validate(null, bodySchema, async (req, query, body) => {
      const {login} = body;

      const user = await this.userRepository.getByLogin(login);

      if(user && user.isEmailVerified === false){
        throw new ValidateError(403, 'Please verify your email address first');
      }

      return body;
    });
  }

  validateForgotPassword() {
    const bodySchema = {
      email: Joi.string().email().required()
    };
    return this.validate(null, bodySchema, (req, query, body) => body.email);
  }

  validateResetPassword() {
    const bodySchema = {
      token: Joi.string().required(),
      password: Joi.string().regex(/^[A-Za-z0-9.@!#$%^*]+$/).min(6).max(60).required()
    };
    return this.validate(null, bodySchema, async (req, query, body) => {
      const {password, token} = body;

      const ResetToken = await this.resetTokenRepository.findActive(token);

      if (!ResetToken) {
        throw new ValidateError(404, tokenConstants.tokenNotFound);
      }

      return {ResetToken, password};
    });
  }

  validatePeerplaysLogin() {
    const bodySchema = {
      login: Joi.string().required(),
      password: Joi.string().required().min(12)
    };
    
    return this.validate(null, bodySchema, async (req, query, body) => body);
  }

  validateCode() {
    const bodySchema = {
      code: Joi.string().required(),
      client_id: Joi.number().integer().required(),
      client_secret: Joi.string().required()
    };

    return this.validate(null, bodySchema, async(req, query, body) => {
      const {code, client_id, client_secret} = body;

      const AppExists = await this.appRepository.model.findOne({where:
      {
        id: client_id,
        app_secret: client_secret
      }});

      if(!AppExists) {
        throw new ValidateError(400, 'Validate error', {
          client_id: 'client_id or client_secret invalid'
        });
      }

      const GrantCodeExists = await this.grantCodeRepository.model.findOne({where:{code}});

      if(!GrantCodeExists) {
        throw new ValidateError(400, 'Validate error', {
          code: 'invalid code'
        });
      }

      if(GrantCodeExists.app_id !== client_id) {
        throw new ValidateError(400, 'Validate error', {
          code: 'code doesn\'t belong to this app'
        });
      }

      return {
        grantCodeId: GrantCodeExists.id,
        appId: AppExists.id,
        scope: GrantCodeExists.scope
      };
    });
  }

  validateAccessToken() {
    return this.validate(null, null, async (req) => {

      if(!req.headers['Authorization'] || !req.headers['ClientID']) {
        throw new ValidateError(401, 'unauthorized');
      }

      const authHeaderArr = req.headers['Authorization'].split(' ');

      if(authHeaderArr.length !== 2 && authHeaderArr[0] !== 'Bearer') {
        throw new ValidateError(401, 'Authorization invalid');
      }

      const AccessToken = await this.accessTokenRepository.model.findOne({
        where: {
          app_id: req.headers['ClientID'],
          token: authHeaderArr[1],
          expires: {
            [Op.gte]: new Date()
          }
        }
      });

      if(!AccessToken) {
        throw new ValidateError(401, 'Access Token invalid or expired');
      }

      return null;
    });
  }
}

module.exports = AuthValidator;
