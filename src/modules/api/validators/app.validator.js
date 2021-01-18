const Joi = require('joi');
const {ChainTypes} = require('peerplaysjs-lib');
const BaseValidator = require('./abstract/base.validator');
const ValidateError = require('../../../errors/validate.error');
const PeerplaysSchemas = require('./abstract/peerplays.schemas');
const url = require('url');
const psl = require('psl');

class AppValidator extends BaseValidator {
  /**
   * @param {AppRepository} opts.appRepository
   * @param {userRepository} opts.userRepository
   * @param {PermissionRepository} opts.permissionRepository
   * @param {AccessTokenRepository} opts.accessTokenRepository
   * @param {OperationRepository} opts.operationRepository
   * @param {AuthorityRepository} opts.authorityRepository
   */
  constructor(opts) {
    super();

    this.appRepository = opts.appRepository;
    this.permissionRepository = opts.permissionRepository;
    this.accessTokenRepository = opts.accessTokenRepository;
    this.operationRepository = opts.operationRepository;
    this.authorityRepository = opts.authorityRepository;
    this.userRepository = opts.userRepository;

    this.registerApp = this.registerApp.bind(this);
    this.deleteApp = this.deleteApp.bind(this);
    this.validateTransaction = this.validateTransaction.bind(this);
    this.joinApp = this.joinApp.bind(this);
    this.getAppOperations = this.getAppOperations.bind(this);
    this.unjoinApp = this.unjoinApp.bind(this);
    this.validateOperations = this.validateOperations.bind(this);
    this.validateBlockchainData = this.validateBlockchainData.bind(this);
    this.validateROPCFlow = this.validateROPCFlow.bind(this);
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
      operations: Joi.array().items(Joi.number().integer().min(0).max(150)).required()
    };
    
    return this.validate(null, bodySchema, async (req, query, body) => {
      const {appname, operations} = body;
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

      if(operations.find((op) => op === 6)) {
        throw new ValidateError(400, 'Validate error', {
          operations: 'Owner key is required for account update'
        });
      }

      if(body.hasOwnProperty('id')) {
        const AppIdExists = await this.appRepository.findByPk(body.id);

        if(!AppIdExists) {
          throw new ValidateError(400, 'Validate error', {
            id: 'App not found'
          });
        }

        const OpsInDb = await this.operationRepository.model.findAll({
          where: {
            app_id: body.id
          }
        });

        const OpsArr = OpsInDb.map(({operation_requested}) => operation_requested);

        const allOpsExist = OpsArr.every((op) => operations.indexOf(op) >= 0)
                            && operations.every((op) => OpsArr.indexOf(op) >= 0);

        if(!allOpsExist) {
          throw new ValidateError('400', 'Validate error', {
            operations: 'Cannot add or delete operations once the app has been created'
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

      const app_id = req.headers['clientid'];

      const Ops = await this.operationRepository.model.findAll({
        where: {app_id}
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

      const Permission = await this.permissionRepository.model.findOne({where: {user_id: req.user.id}});

      if(!Permission) {
        throw new ValidateError(401, 'Unauthorized', {
          user: 'Permission does not exist for this user'
        });
      }

      const AuthCount = await this.authorityRepository.model.count({where: {user_id: req.user.id}});

      if(AuthCount > 15) {
        throw new ValidateError(400, 'Validate error', {
          user: 'Max operations that can be linked to this user reached'
        });
      }

      const Authorities = await this.authorityRepository.model.findAll({
        where: {
          app_id: client_id,
          user_id: req.user.id
        }
      });

      if(Authorities && Authorities.length > 0) {
        throw new ValidateError(400, 'Validate error', {
          user: 'You have already joined this app'
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

      const Ops = await this.operationRepository.model.count({
        where: {
          app_id: client_id
        }
      });

      if(AuthCount + Ops > 15) {
        throw new ValidateError(400, 'Validate error', {
          user: 'Max operations that can be linked to this user will be reached while joining this app'
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

      const Permission = await this.permissionRepository.model.findOne({where: {user_id: req.user.id}});

      if(!Permission) {
        throw new ValidateError(401, 'Unauthorized', {
          app_id: 'Permission does not exist for this user'
        });
      }

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

      return AppExists;
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

  validateOperations() {
    const bodySchema = {
      operations: Joi.array().items(
        Joi.alternatives()
          .conditional('.op_name', {
            switch: [
              {is: 'transfer', then: PeerplaysSchemas.transferSchema},
              {is: 'limit_order_create', then: PeerplaysSchemas.limitOrderCreateSchema},
              {is: 'limit_order_cancel', then: PeerplaysSchemas.limitOrderCancelSchema},
              {is: 'call_order_update', then: PeerplaysSchemas.callOrderUpdateSchema},
              {is: 'fill_order', then: PeerplaysSchemas.fillOrderSchema},
              {is: 'account_create', then: PeerplaysSchemas.accountCreateSchema},
              {is: 'account_update', then: PeerplaysSchemas.accountUpdateSchema},
              {is: 'account_whitelist', then: PeerplaysSchemas.accountWhitelistSchema},
              {is: 'account_upgrade', then: PeerplaysSchemas.accountUpgradeSchema},
              {is: 'account_transfer', then: PeerplaysSchemas.accountTransferSchema},
              {is: 'asset_create', then: PeerplaysSchemas.assetCreateSchema},
              {is: 'asset_update', then: PeerplaysSchemas.assetUpdateSchema},
              {is: 'asset_update_bitasset', then: PeerplaysSchemas.assetUpdateBitassetSchema},
              {is: 'asset_update_feed_producers', then: PeerplaysSchemas.assetUpdateFeedProducerSchema},
              {is: 'asset_issue', then: PeerplaysSchemas.assetIssueSchema},
              {is: 'asset_reserve', then: PeerplaysSchemas.assetReserveSchema},
              {is: 'asset_fund_fee_pool', then: PeerplaysSchemas.assetFundFeePoolSchema},
              {is: 'asset_settle', then: PeerplaysSchemas.assetSettleSchema},
              {is: 'asset_global_settle', then: PeerplaysSchemas.assetGlobalSettleSchema},
              {is: 'asset_publish_feed', then: PeerplaysSchemas.assetPublishFeedSchema},
              {is: 'witness_create', then: PeerplaysSchemas.witnessCreateSchema},
              {is: 'witness_update', then: PeerplaysSchemas.witnessUpdateSchema},
              {is: 'proposal_create', then: PeerplaysSchemas.proposalCreateSchema},
              {is: 'proposal_update', then: PeerplaysSchemas.proposalUpdateSchema},
              {is: 'proposal_delete', then: PeerplaysSchemas.proposalDeleteSchema},
              {is: 'withdraw_permission_create', then: PeerplaysSchemas.withdrawPermissionCreateSchema},
              {is: 'withdraw_permission_update', then: PeerplaysSchemas.withdrawPermissionUpdateSchema},
              {is: 'withdraw_permission_claim', then: PeerplaysSchemas.withdrawPermissionClaimSchema},
              {is: 'withdraw_permission_delete', then: PeerplaysSchemas.withdrawPermissionDeleteSchema},
              {is: 'committee_member_create', then: PeerplaysSchemas.committeeMemberCreateSchema},
              {is: 'committee_member_update', then: PeerplaysSchemas.committeeMemberUpdateSchema},
              {is: 'committee_member_update_global_parameters', then: PeerplaysSchemas.committeeMemberUpdateGlobalParameters},
              {is: 'vesting_balance_create', then: PeerplaysSchemas.vestingBalanceCreateSchema},
              {is: 'vesting_balance_withdraw', then: PeerplaysSchemas.vestingBalanceWithdrawSchema},
              {is: 'worker_create', then: PeerplaysSchemas.workerCreateSchema},
              {is: 'custom', then: PeerplaysSchemas.customSchema},
              {is: 'assert', then: PeerplaysSchemas.assertSchema},
              {is: 'balance_claim', then: PeerplaysSchemas.balanceClaimSchema},
              {is: 'override_transfer', then: PeerplaysSchemas.overrideTransferSchema},
              {is: 'transfer_to_blind', then: PeerplaysSchemas.transferToBlindSchema},
              {is: 'blind_transfer', then: PeerplaysSchemas.blindTransferSchema},
              {is: 'transfer_from_blind', then: PeerplaysSchemas.transferFromBlindSchema},
              {is: 'asset_settle_cancel', then: PeerplaysSchemas.assetSettleCancelSchema},
              {is: 'asset_claim_fees', then: PeerplaysSchemas.assetClaimFeesSchema},
              {is: 'fba_distribute', then: PeerplaysSchemas.fbaDistributeSchema},
              {is: 'tournament_create', then: PeerplaysSchemas.tournamentCreateSchema},
              {is: 'tournament_join', then: PeerplaysSchemas.tournamentJoinSchema},
              {is: 'game_move', then: PeerplaysSchemas.gameMoveSchema},
              {is: 'asset_update_dividend', then: PeerplaysSchemas.assetUpdateDividendSchema},
              {is: 'asset_dividend_distribution', then: PeerplaysSchemas.assetDividendDistributionSchema},
              {is: 'sport_create', then: PeerplaysSchemas.sportCreateSchema},
              {is: 'sport_update', then: PeerplaysSchemas.sportUpdateSchema},
              {is: 'event_group_create', then: PeerplaysSchemas.eventGroupCreateSchema},
              {is: 'event_group_update', then: PeerplaysSchemas.eventGroupUpdateSchema},
              {is: 'event_create', then: PeerplaysSchemas.eventCreateSchema},
              {is: 'event_update', then: PeerplaysSchemas.eventUpdateSchema},
              {is: 'betting_market_rules_create', then: PeerplaysSchemas.bettingMarketRulesCreateSchema},
              {is: 'betting_market_rules_update', then: PeerplaysSchemas.bettingMarketRulesUpdateSchema},
              {is: 'betting_market_group_create', then: PeerplaysSchemas.bettingMarketGroupCreateSchema},
              {is: 'betting_market_create', then: PeerplaysSchemas.bettingMarketCreateSchema},
              {is: 'bet_place', then: PeerplaysSchemas.betPlaceSchema},
              {is: 'betting_market_group_resolve', then: PeerplaysSchemas.bettingMarketGroupResolveSchema},
              {is: 'betting_market_group_resolved', then: PeerplaysSchemas.bettingMarketGroupResolvedSchema},
              {is: 'betting_market_group_cancel_unmatched_bets', then: PeerplaysSchemas.bettingMarketGroupCancelUnmatchedBetsSchema},
              {is: 'bet_matched', then: PeerplaysSchemas.betMatchedSchema},
              {is: 'bet_cancel', then: PeerplaysSchemas.betCancelSchema},
              {is: 'bet_canceled', then: PeerplaysSchemas.betCanceledSchema},
              {is: 'tournament_payout', then: PeerplaysSchemas.tournamentPayoutSchema},
              {is: 'tournament_leave', then: PeerplaysSchemas.tournamentLeaveSchema},
              {is: 'betting_market_group_update', then: PeerplaysSchemas.bettingMarketGroupUpdateSchema},
              {is: 'betting_market_update', then: PeerplaysSchemas.bettingMarketUpdateSchema},
              {is: 'bet_adjusted', then: PeerplaysSchemas.betAdjustedSchema},
              {is: 'lottery_asset_create', then: PeerplaysSchemas.lotteryAssetCreateSchema},
              {is: 'ticket_purchase', then: PeerplaysSchemas.ticketPurchaseSchema},
              {is: 'lottery_reward', then: PeerplaysSchemas.lotteryRewardSchema},
              {is: 'lottery_end', then: PeerplaysSchemas.lotteryEndSchema},
              {is: 'sweeps_vesting_claim', then: PeerplaysSchemas.sweepsVestingClaimSchema},
              {is: 'custom_permission_create', then: PeerplaysSchemas.customPermissionCreateSchema},
              {is: 'custom_permission_update', then: PeerplaysSchemas.customPermissionUpdateSchema},
              {is: 'custom_permission_delete', then: PeerplaysSchemas.customPermissionDeleteSchema},
              {is: 'custom_account_authority_create', then: PeerplaysSchemas.customAccountAuthorityCreateSchema},
              {is: 'custom_account_authority_update', then: PeerplaysSchemas.customAccountAuthorityUpdateSchema},
              {is: 'custom_account_authority_delete', then: PeerplaysSchemas.customAccountAuthorityDeleteSchema},
              {is: 'offer', then: PeerplaysSchemas.offerSchema},
              {is: 'bid', then: PeerplaysSchemas.bidSchema},
              {is: 'cancel_offer', then: PeerplaysSchemas.cancelOfferSchema},
              {is: 'finalize_offer', then: PeerplaysSchemas.finalizeOfferSchema},
              {is: 'nft_metadata_create', then: PeerplaysSchemas.nftCreateSchema},
              {is: 'nft_metadata_update', then: PeerplaysSchemas.nftUpdateSchema},
              {is: 'nft_mint', then: PeerplaysSchemas.nftMintSchema},
              {is: 'nft_safe_transfer_from', then: PeerplaysSchemas.nftSafeTransferSchema},
              {is: 'nft_approve', then: PeerplaysSchemas.nftApproveSchema},
              {is: 'nft_set_approval_for_all', then: PeerplaysSchemas.nftApproveAllSchema},
              {is: 'account_role_create', then: PeerplaysSchemas.accountRoleCreateSchema},
              {is: 'account_role_update', then: PeerplaysSchemas.accountRoleUpdateSchema},
              {is: 'account_role_delete', then: PeerplaysSchemas.accountRoleDeleteSchema},
              {is: 'son_create', then: PeerplaysSchemas.sonCreateSchema},
              {is: 'son_update', then: PeerplaysSchemas.sonUpdateSchema},
              {is: 'son_deregister', then: PeerplaysSchemas.sonDeregisterSchema},
              {is: 'son_heartbeat', then: PeerplaysSchemas.sonHeartbeatSchema},
              {is: 'son_report_down', then: PeerplaysSchemas.sonReportDownSchema},
              {is: 'son_maintenance', then: PeerplaysSchemas.sonMaintenanceSchema},
              {is: 'son_wallet_recreate', then: PeerplaysSchemas.sonWalletRecreateSchema},
              {is: 'son_wallet_update', then: PeerplaysSchemas.sonWalletUpdateSchema},
              {is: 'son_wallet_deposit_create', then: PeerplaysSchemas.sonWalletDepositCreateSchema},
              {is: 'son_wallet_deposit_process', then: PeerplaysSchemas.sonWalletDepositProcessSchema},
              {is: 'son_wallet_withdraw_create', then: PeerplaysSchemas.sonWalletWithdrawCreateSchema},
              {is: 'son_wallet_withdraw_process', then: PeerplaysSchemas.sonWalletWithdrawProcessSchema},
              {is: 'sidechain_address_add', then: PeerplaysSchemas.sidechainAddressAddSchema},
              {is: 'sidechain_address_update', then: PeerplaysSchemas.sidechainAddressUpdateSchema},
              {is: 'sidechain_address_delete', then: PeerplaysSchemas.sidechainAddressDeleteSchema},
              {is: 'sidechain_transaction_create', then: PeerplaysSchemas.sidechainTransactionCreateSchema},
              {is: 'sidechain_transaction_sign', then: PeerplaysSchemas.sidechainTransactionSignSchema},
              {is: 'sidechain_transaction_send', then: PeerplaysSchemas.sidechainTransactionSendSchema},
              {is: 'sidechain_transaction_settle', then: PeerplaysSchemas.sidechainTransactionSettleSchema},
              {is: 'nft_lottery_token_purchase', then: PeerplaysSchemas.nftLotteryPurchaseSchema},
              {is: 'nft_lottery_reward', then: PeerplaysSchemas.nftLotteryRewardSchema},
              {is: 'nft_lottery_end', then: PeerplaysSchemas.nftLotteryEndSchema},
              {is: 'random_number_store', then: PeerplaysSchemas.randomNumberStoreSchema}
            ]
          })
      ).required()
    };

    return this.validate(null, bodySchema, async (req, query, body) => {
      let app_id = req.headers['clientid'];

      const authHeader = req.headers['authorization'].split(' ')[1];
      const AccessToken = await this.accessTokenRepository.model.findOne({
        where: {
          token: authHeader
        }
      });

      const Ops = await this.operationRepository.model.findAll({
        where: {app_id}
      });

      const OpsArr = Ops.map(({operation_requested}) => operation_requested);

      const OpsInBody = body.operations.map(({op_name}) => ChainTypes.operations[op_name]);

      const allOpsExist = OpsInBody.every((op) => OpsArr.indexOf(op) >= 0);

      if(!allOpsExist) {
        throw new ValidateError('400', 'Validate error', {
          op_name: 'Operation invalid'
        });
      }

      const Authorities = await this.authorityRepository.model.findAll({
        where: {
          app_id,
          user_id: AccessToken.user_id
        }
      });

      const OpsInAuths = Authorities.map(({operation}) => operation);

      const allOpsExistInAuthorities = OpsInBody.every((op) => OpsInAuths.indexOf(op) >= 0);

      if(!allOpsExistInAuthorities) {
        throw new ValidateError('400', 'Validate error', {
          app_id: 'App is missing permission for some of the operations'
        });
      }

      return body.operations;
    });
  }

  validateBlockchainData() {
    const querySchema = {
      api: Joi.string().valid('database','network_broadcast','history','crypto','bookie').required(),
      method: Joi.string().required(),
      params: Joi.array().optional()
    };

    return this.validate(querySchema, null, async (req, query) => query);
  }

  validateROPCFlow() {
    const bodySchema = {
      login: Joi.string().required(),
      password: Joi.string().optional(),
      mobile: Joi.string().optional(),
      client_id: Joi.number().integer().required()
    };

    return this.validate(null, bodySchema, async (req, query, body) => {
      const {login, password, mobile, client_id} = body;

      const user = await this.userRepository.getByLogin(login);

      if(!user) {
        throw new ValidateError(400, 'Validate error', {
          login: 'User not found'
        });
      }

      if(!password && !mobile) {
        throw new ValidateError(400, 'Validate error', {
          mobile: 'Either mobile or password is required',
          password: 'Either mobile or password is required'
        });
      }

      const Permission = await this.permissionRepository.model.findOne({where: {user_id: user.id}});

      if(!Permission) {
        throw new ValidateError(401, 'Unauthorized', {
          login: 'Permission does not exist for this user'
        });
      }

      const AuthCount = await this.authorityRepository.model.count({where: {user_id: user.id}});

      if(AuthCount > 15) {
        throw new ValidateError(400, 'Validate error', {
          login: 'Max operations that can be linked to this user reached'
        });
      }

      const Authorities = await this.authorityRepository.model.findAll({
        where: {
          app_id: client_id,
          user_id: user.id
        }
      });

      if(Authorities && Authorities.length > 0) {
        throw new ValidateError(400, 'Validate error', {
          login: 'You have already joined this app'
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

      const Ops = await this.operationRepository.model.count({
        where: {
          app_id: client_id
        }
      });

      if(AuthCount + Ops > 15) {
        throw new ValidateError(400, 'Validate error', {
          login: 'Max operations that can be linked to this user will be reached while joining this app'
        });
      }

      return {
        ...body,
        AppExists
      };
    });
  }
}

module.exports = AppValidator;