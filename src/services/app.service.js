const uid = require('uid2');
const ValidateError = require('../errors/validate.error');
const OperationUtil = require('../utils/operation.util');

class AppService {

  /**
     * @param {Config} opts.config
     * @param {AppRepository} opts.appRepository
     * @param {UserRepository} opts.userRepository
     * @param {OperationRepository} opts.operationRepository
     * @param {AuthorityRepository} opts.authorityRepository
     * @param {AccessTokenRepository} opts.accessTokenRepository
     * @param {PeerplaysRepository} opts.peerplaysRepository
     * @param {PermissionRepository} opts.permissionRepository
     * @param {GrantCodeRepository} opts.grantCodeRepository
     * @param {PeerplaysConnection} opts.peerplaysConnection
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

    for(let i = 0; i < Apps.length; i++) {
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

  async createAccessToken(grantCode, appId, scope) {
    const Auth = await this.authorityRepository.model.findOne({
      where: {
        user_id: grantCode.user_id,
        app_id: appId
      }
    });

    const user = await this.userRepository.model.findByPk(grantCode.user_id);

    if(Auth.expiry < new Date()) {
      const Authorities = await this.authorityRepository.model.findAll({where: {user_id: user.id, app_id: appId}});

      let today = new Date();
      let year = today.getFullYear();
      let month = today.getMonth();
      let day = today.getDate();
      let threeMonthsFromNow = new Date(year, month + 3, day);

      let customAuths = [];

      try {
        for(let i = 0; i < Authorities.length; i++) {
          const customAuth = await this.peerplaysRepository.createSendTransaction('custom_account_authority_update', {
            fee: {
              amount: 0,
              asset_id: this.config.peerplays.feeAssetId
            },
            auth_id: Authorities[i].peerplays_account_auth_id,
            new_valid_from: Math.floor(new Number(today)/1000),
            new_valid_to: Math.floor(new Number(threeMonthsFromNow)/1000),
            owner_account: user.peerplaysAccountId,
            extensions: null
          });

          Authorities[i].expiry = customAuth.trx.operations[0][1].valid_to;
          Authorities[i].save();

          customAuths.push(customAuth);
        }
      } catch(err) {
        console.error(err);
        throw new Error('Peerplays HRP Error');
      }

      if(customAuths && customAuths.length > 0) {
        const token = await this.generateUniqueAccessToken();
        const refresh_token = await this.generateUniqueRefreshToken();
        return this.accessTokenRepository.model.create({
          app_id: appId,
          grantcode_id: grantCode.id,
          user_id: user.id,
          refresh_token,
          expires: threeMonthsFromNow,
          scope,
          token
        });
      }
    } else {
      const token = await this.generateUniqueAccessToken();
      const refresh_token = await this.generateUniqueRefreshToken();
      return this.accessTokenRepository.model.create({
        app_id: appId,
        grantcode_id: grantCode.id,
        user_id: user.id,
        refresh_token,
        expires: Auth.expiry,
        scope,
        token
      });
    }
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

  async generateUniqueRefreshToken() {
    const uuid = uid(124);

    const RefreshTokenExists = await this.accessTokenRepository.model.findOne({
      where: {
        refresh_token: uuid
      }
    });

    if(RefreshTokenExists) {
      return await this.generateUniqueRefreshToken();
    }

    return uuid;
  }

  async broadcastTransaction(transaction) {
    return this.peerplaysRepository.broadcastSerializedTx(transaction);
  }

  async joinApp(user, app) {
    const Permission = await this.permissionRepository.model.findOne({where: {user_id: user.id}});

    const Ops = await this.operationRepository.model.findAll({
      where: {app_id: app.id}
    });

    let customAuths = [];

    try{
      let today = new Date();
      let year = today.getFullYear();
      let month = today.getMonth();
      let day = today.getDate();
      let threeMonthsFromNow = new Date(year, month + 3, day);

      for(let i = 0; i < Ops.length; i++) {
        const customAuth = await this.peerplaysRepository.createSendTransaction('custom_account_authority_create', {
          fee: {
            amount: 0,
            asset_id: this.config.peerplays.feeAssetId
          },
          permission_id: Permission.peerplays_permission_id,
          operation_type: Ops[i].operation_requested,
          valid_from: Math.floor(new Number(today)/1000),
          valid_to: Math.floor(new Number(threeMonthsFromNow)/1000),
          owner_account: user.peerplaysAccountId,
          extensions: null
        });

        await this.authorityRepository.model.create({
          peerplays_permission_id: customAuth.trx.operations[0][1].permission_id,
          peerplays_account_auth_id: customAuth.trx.operation_results[0][1],
          operation: customAuth.trx.operations[0][1].operation_type,
          expiry: customAuth.trx.operations[0][1].valid_to,
          app_id: app.id,
          user_id: user.id,
          permission_id: Permission.id
        });

        customAuths.push(customAuth);
      }
    } catch(err) {
      console.error(err);
      throw new Error('Peerplays HRP Error');
    }

    let code = '';

    if(customAuths && customAuths.length > 0) {
      code = await this.getGrantCode(app, user);
    }

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

        if(Auth && Auth.app_id) {
          const app = await this.getOperationsForApp(Auth.app_id);

          permittedApps.push({
            ...app,
            auth_id: customAuths[i].id
          });
        }
      }
    }

    return permittedApps;
  }

  async unjoinApp(user, app) {
    let customAuths = [];

    try {
      const Authorities = await this.authorityRepository.model.findAll({where: {user_id: user.id, app_id: app.id}});

      for(let i = 0; i < Authorities.length; i++) {
        const customAuth = await this.peerplaysRepository.createSendTransaction('custom_account_authority_delete', {
          fee: {
            amount: 0,
            asset_id: this.config.peerplays.feeAssetId
          },
          auth_id: Authorities[i].peerplays_account_auth_id,
          owner_account: user.peerplaysAccountId,
          extensions: null
        });

        customAuths.push(customAuth);
      }
    } catch(err) {
      console.error(err);
      throw new Error('Peerplays HRP Error');
    }

    if(customAuths && customAuths.length > 0) {
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

  async refreshAccessToken(user, app_id, AccessToken) {
    let customAuths = [];

    const Authorities = await this.authorityRepository.model.findAll({where: {user_id: AccessToken.user_id, app_id}});

    const User = await this.userRepository.findByPk(AccessToken.user_id);

    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth();
    let day = today.getDate();
    let threeMonthsFromNow = new Date(year, month + 3, day);

    try {
      for(let i = 0; i < Authorities.length; i++) {
        const customAuth = await this.peerplaysRepository.createSendTransaction('custom_account_authority_update', {
          fee: {
            amount: 0,
            asset_id: this.config.peerplays.feeAssetId
          },
          auth_id: Authorities[i].peerplays_account_auth_id,
          new_valid_from: Math.floor(new Number(today)/1000),
          new_valid_to: Math.floor(new Number(threeMonthsFromNow)/1000),
          owner_account: User.peerplaysAccountId,
          extensions: null
        });

        Authorities[i].expiry = customAuth.trx.operations[0][1].new_valid_to;
        Authorities[i].save();

        customAuths.push(customAuth);
      }
    } catch(err) {
      console.error(err);
      throw new Error('Peerplays HRP Error');
    }

    if(customAuths && customAuths.length > 0) {
      const token = await this.generateUniqueAccessToken();
      const refresh_token = await this.generateUniqueRefreshToken();

      AccessToken.token = token;
      AccessToken.refresh_token = refresh_token;
      AccessToken.expires = threeMonthsFromNow;
      AccessToken.save();
    }

    return AccessToken;
  }

  async broadcastOperations(op) {
    const opJson = OperationUtil.queryToOperationJson(op);
    return this.peerplaysRepository.createTransactionFromOps(opJson);
  }

  async getBlockchainData(query) {
    return this.peerplaysRepository.getBlockchainData(query);
  }
}

module.exports = AppService;