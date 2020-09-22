const uid = require('uid2');

class AppService {

  /**
     * @param {Config} opts.config
     * @param {AppRepository} opts.appRepository
     * @param {OperationRepository} opts.operationRepository
     * @param {AuthorityRepository} opts.authorityRepository
     * @param {AccessTokenRepository} opts.accessTokenRepository
     * @param {PeerplaysRepository} opts.peerplaysRepository
     * @param {PermissionRepository} opts.permissionRepository
     */
  constructor(opts) {
    this.config = opts.config;
    this.appRepository = opts.appRepository;
    this.operationRepository = opts.operationRepository;
    this.authorityRepository = opts.authorityRepository;
    this.accessTokenRepository = opts.accessTokenRepository;
    this.peerplaysRepository = opts.peerplaysRepository;
    this.permissionRepository = opts.permissionRepository;
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
          await this.operationRepository.model.delete({
            where: {
              app_id: App[0].id,
              operation_requested: OpsArr[i]
            }
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
    const deleted = await this.appRepository.model.delete({
      where: {id}
    });

    if(deleted !== 0) {
      await this.operationRepository.model.delete({
        where: {
          app_id: id
        }
      });

      await this.authorityRepository.model.delete({
        where: {
          app_id: id
        }
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

    for(let i = 0; i < customAuths.length; i++) {
      await this.authorityRepository.model.create({
        peerplays_permission_id: Permission.peerplays_permission_id,
        peerplays_account_auth_id: customAuths[i].trx.operation_results[0][1],
        operation: customAuths[i].trx.operatio_results[0][0].operation_type,
        expiry: new Date(0).setUTCSeconds(customAuths[i].trx.operatio_results[0][0].valid_to),
        app_id: app.id,
        user_id: user.id
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

    if(!grant) {
      return await this.generateUniqueGrantCode();
    }

    return code;
  }

  async getOperationsForApp(app_id) {
    const Ops = await this.operationRepository.model.findAll({
      where: {app_id}
    });

    const OpsArr = Ops.map(({operation_requested}) => operation_requested);

    return OpsArr;
  }
}

module.exports = AppService;