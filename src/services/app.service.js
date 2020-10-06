const uid = require('uid2');
const ValidateError = require('../errors/validate.error');

class AppService {

  /**
     * @param {Config} opts.config
     * @param {AppRepository} opts.appRepository
     * @param {OperationRepository} opts.operationRepository
     * @param {AuthorityRepository} opts.authorityRepository
     * @param {AccessTokenRepository} opts.accessTokenRepository
     * @param {PeerplaysRepository} opts.peerplaysRepository
     * @param {PermissionRepository} opts.permissionRepository
     * @param {GrantCodeRepository} opts.grantCodeRepository
     */
  constructor(opts) {
    this.config = opts.config;
    this.appRepository = opts.appRepository;
    this.userRepository = opts.userRepository;
    this.operationRepository = opts.operationRepository;
    this.authorityRepository = opts.authorityRepository;
    this.accessTokenRepository = opts.accessTokenRepository;
    this.peerplaysRepository = opts.peerplaysRepository;
    this.permissionRepository = opts.permissionRepository;
    this.grantCodeRepository = opts.grantCodeRepository;
    this.peerplaysConnection = opts.peerplaysConnection;
  }

  async registerApp(data, user_id) {
    const App = await this.appRepository.model.upsert({
      ...data,
      registrar_id: user_id
    }, {returning: true});

    if(data.hasOwnProperty('id')) {
      const appSecret = await this.generateUniqueAppSecret();
      App[0].app_secret = appSecret;
      App[0].save();

      const Ops = await this.operationRepository.model.findAll({
        where: {
          app_id: App[0].id
        }
      });

      const OpsArr = Ops.map(({operation_requested}) => operation_requested);

      for(let i = 0; i < data.operations.length; i++) {
        if(!OpsArr.includes(data.operations[i])) {
          await this.operationRepository.model.create({
            app_id: App[0].id,
            operation_requested: data.operations[i]
          });
        }
      }

      for(let i = 0; i < OpsArr.length; i++) {
        if(!data.operations.includes(OpsArr[i])) {
          await this.operationRepository.model.destroy({
            where: {
              app_id: App[0].id,
              operation_requested: OpsArr[i]
            },
            force: true
          });
        }
      }
    } else {
      await Promise.all(data.operations.map(async (operation) => {
        await this.operationRepository.model.create({
          app_id: App[0].id,
          operation_requested: operation
        });
      }));
    }

    return App[0].getPublic();
  }

  async getApps(user_id) {
    const Apps = await this.appRepository.model.findAll({
      where: {
        registrar_id: user_id
      },
      raw: true
    });

    for(let i = 0; i < Apps.length; i++)
    {
      const Operations = await this.operationRepository.model.findAll({
        where: {
          app_id: Apps[i].id
        }
      });

      const Ops = Operations.map((op) => op.operation_requested);
      Apps[i].operations = Ops;
    }

    return Apps;
  }

  async deleteApp(id) {
    const deleted = await this.appRepository.model.destroy({
      where: {id},
      force: true
    });

    if(deleted !== 0) {
      await this.operationRepository.model.destroy({
        where: {
          app_id: id
        },
        force: true
      });

      await this.authorityRepository.model.destroy({
        where: {
          app_id: id
        },
        force: true
      });

      await this.grantCodeRepository.model.destroy({
        where: {
          app_id: id
        },
        force: true
      });

      await this.accessTokenRepository.model.destroy({
        where: {
          app_id: id
        },
        force: true
      });
    }

    return deleted !== 0;
  }

  async generateUniqueAppSecret() {
    const uuid = uid(42);

    const UIDExists = await this.appRepository.model.findOne({
      where: {
        app_secret: uuid
      }
    });

    if(UIDExists) {
      return await this.generateUniqueAppSecret();
    }

    return uuid;
  }

  async createAccessToken(grantCodeId, appId, userId, scope) {
    const token = await this.generateUniqueAccessToken();
    return this.accessTokenRepository.model.create({
      app_id: appId,
      grantcode_id: grantCodeId,
      user_id: userId,
      scope,
      token
    });
  }

  async generateUniqueAccessToken() {
    const uuid = uid(124);

    const AccessTokenExists = await this.accessTokenRepository.model.findOne({
      where: {
        token: uuid
      }
    });

    if(AccessTokenExists) {
      return await this.generateUniqueAccessToken();
    }

    return uuid;
  }

  async broadcastTransaction(transaction) {
    return this.peerplaysRepository.broadcastSerializedTx(transaction);
  }

  async joinApp(user, app, custom_account_auth_trx) {
    const Permission = await this.permissionRepository.model.findOne({where: { user_id: user.id }});

    const customAuths = await this.broadcastTransaction(custom_account_auth_trx);

    for(let i = 0; i < customAuths[0].trx.operation_results.length; i++) {
      await this.authorityRepository.model.create({
        peerplays_permission_id: customAuths[0].trx.operations[i][1].permission_id,
        peerplays_account_auth_id: customAuths[0].trx.operation_results[i][1],
        operation: customAuths[0].trx.operations[i][1].operation_type,
        expiry: customAuths[0].trx.operations[i][1].valid_to,
        app_id: app.id,
        user_id: user.id,
        permission_id: Permission.id
      });
    }

    const code = await this.getGrantCode(app, user);
    return code;
  }

  async getGrantCode(app, User) {
    const Ops = await this.operationRepository.model.findAll({
      where: {app_id: app.id}
    });

    const OpsArr = Ops.map(({operation_requested}) => operation_requested);

    const code = await this.generateUniqueGrantCode();

    await this.grantCodeRepository.model.create({
      app_id: app.id,
      user_id: User.id,
      scope: OpsArr,
      code
    });

    return code;
  }

  async generateUniqueGrantCode() {
    const code = uid(24);

    const grant = await this.grantCodeRepository.model.findOne({
      where: {code}
    });

    if(grant) {
      return await this.generateUniqueGrantCode();
    }

    return code;
  }

  async getOperationsForApp(app_id) {
    const App = await this.appRepository.findByPk(app_id);
    const Ops = await this.operationRepository.model.findAll({
      where: {app_id}
    });

    const OpsArr = Ops.map(({operation_requested}) => operation_requested);

    return {
      ...App.getPublic(),
      operations: OpsArr
    };
  }

  async getPermittedApps(user) {
    let customAuths, permittedApps = [];
    try{
      customAuths = await this.peerplaysConnection.dbAPI.exec('get_custom_account_authorities', [user.peerplaysAccountId]);
    } catch(e) {
      throw new ValidateError(400, 'Validate error', 'Couldnot fetch custom account authorities');
    }

    if(customAuths) {
      for(let i = 0; i < customAuths.length; i++) {
        const Auth = await this.authorityRepository.model.findOne({
          where: {
            peerplays_account_auth_id: customAuths[i].id
          }
        });

        const app = await this.getOperationsForApp(Auth.app_id);

        permittedApps.push({
          ...app,
          auth_id: customAuths[i].id
        });
      }
    }

    return permittedApps;
  }

  async unjoinApp(user, app, custom_account_auth_trx) {
    const customAuths = await this.broadcastTransaction(custom_account_auth_trx);

    if(customAuths) {
      await this.authorityRepository.model.destroy({
        where: {
          app_id: app.id,
          user_id: user.id
        },
        force: true
      });

      await this.grantCodeRepository.model.destroy({
        where: {
          app_id: app.id,
          user_id: user.id
        },
        force: true
      });

      await this.accessTokenRepository.model.destroy({
        where: {
          app_id: app.id,
          user_id: user.id
        },
        force: true
      });
    }

    return true;
  }
}

module.exports = AppService;