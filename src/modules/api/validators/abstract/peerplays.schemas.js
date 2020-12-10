const Joi = require('joi');

/**
 * @swagger
 *
 * definitions:
 *  PeerplaysAccountIDType:
 *    type: string
 *    pattern: '^(1.2.)\d+$'
 *    example: 1.2.31
 *  PeerplaysAssetIDType:
 *    type: string
 *    pattern: '^(1.3.)\d+$'
 *    example: 1.3.0
 *  PeerplaysAmountType:
 *    type: integer
 *    maximum: 1000000000000
 *    example: 100000000
 *  PeerplaysAssetType:
 *    type: object
 *    required:
 *      - amount
 *      - asset_id
 *    properties:
 *      amount:
 *        $ref: '#/definitions/PeerplaysAmountType'
 *      asset_id:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *  TransferRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - from
 *      - to
 *      - amount
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - transfer
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      from:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      to:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      amount:
 *        $ref: '#/definitions/PeerplaysAssetType'
 *      memo:
 *        type: string
 *  Benefactor:
 *    type: object
 *    required:
 *      - id
 *      - share
 *    properties:
 *      id:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      share:
 *        type: integer
 *        maximum: 10000
 *        example: 5000
 *  LotteryOptions:
 *    type: object
 *    required:
 *      - benefactors
 *      - winning_tickets
 *      - ticket_price
 *      - end_date
 *      - ending_on_soldout
 *      - is_active
 *      - delete_tickets_after_draw
 *      - progressive_jackpots
 *    properties:
 *      benefactors:
 *        type: array
 *        items:
 *          $ref: '#/definitions/Benefactor'
 *      winning_tickets:
 *        type: array
 *        items:
 *          type: integer
 *          max: 10000
 *      ticket_price:
 *        type:
 *          $ref: '#/definitions/PeerplaysAssetType'
 *      end_date:
 *        type: integer
 *        example: 1608897600
 *      ending_on_soldout:
 *        type: boolean
 *      is_active:
 *        type: boolean
 *      delete_tickets_after_draw:
 *        type: boolean
 *      progressive_jackpots:
 *        type: string
 *        pattern: '^(1.30.)\d+$'
 *        example: 1.30.0
 *  NftCreateRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - owner
 *      - name
 *      - symbol
 *      - base_uri
 *      - is_transferable
 *      - is_sellable
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - nft_metadata_create
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      owner:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      name:
 *        type: string
 *        example: nft_test
 *      symbol:
 *        type: string
 *        example: nfttest1
 *      base_uri:
 *        type: string
 *        format: uri
 *        example: http://abc.com
 *      revenue_partner:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      revenue_split:
 *        type: integer
 *        maximum: 10000
 *        example: 5000
 *      is_transferable:
 *        type: boolean
 *      is_sellable:
 *        type: boolean
 *      account_role:
 *        type: string
 *        pattern: '^(1.32.)\d+$'
 *        example: 1.32.0
 *      max_supply:
 *        $ref: '#/definitions/PeerplaysAmountType'
 *      lottery_options:
 *        $ref: '#/definitions/LotteryOptions'
 *  NftUpdateRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - owner
 *      - nft_metadata_id
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - nft_metadata_update
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      owner:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      nft_metadata_id:
 *        type: string
 *        pattern: '^(1.30.)\d+$'
 *        example: 1.30.0
 *      name:
 *        type: string
 *        example: nft_test
 *      symbol:
 *        type: string
 *        example: nfttest1
 *      base_uri:
 *        type: string
 *        format: uri
 *        example: http://abc.com
 *      revenue_partner:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      revenue_split:
 *        type: integer
 *        maximum: 10000
 *        example: 5000
 *      is_transferable:
 *        type: boolean
 *      is_sellable:
 *        type: boolean
 *      account_role:
 *        type: string
 *        pattern: '^(1.32.)\d+$'
 *        example: 1.32.0
 *  NftMintRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - payer
 *      - nft_metadata_id
 *      - owner
 *      - approved
 *      - approved_operators
 *      - token_uri
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - nft_mint
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      payer:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      nft_metadata_id:
 *        type: string
 *        pattern: '^(1.30.)\d+$'
 *        example: 1.30.0
 *      owner:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      approved:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      approved_operators:
 *        type: array
 *        items:
 *          $ref: '#/definitions/PeerplaysAccountIDType'
 *      token_uri:
 *        type: string
 *        example: /pics/2k32s2ks
 *  NftSafeTransferRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - operator_
 *      - from
 *      - to
 *      - token_id
 *      - data
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - nft_safe_transfer_from
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      operator_:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      from:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      to:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      token_id:
 *        type: string
 *        pattern: '^(1.31.)\d+$'
 *        example: 1.31.0
 *      data:
 *        type: string
 *  NftApproveRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - operator_
 *      - approved
 *      - token_id
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - nft_approve
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      operator_:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      approved:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      token_id:
 *        type: string
 *        pattern: '^(1.31.)\d+$'
 *        example: 1.31.0
 *  NftApproveAllRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - owner
 *      - operator_
 *      - approved
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - nft_set_approval_for_all
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      owner:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      operator_:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      approved:
 *        type: boolean
 *  OfferRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - item_ids
 *      - issuer
 *      - minimum_price
 *      - maximum_price
 *      - buying_item
 *      - offer_expiration_date
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - offer
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      item_ids:
 *        type: array
 *        items:
 *          type: string
 *          pattern: '^(1.31.)\d+$'
 *          example: 1.31.0
 *      issue:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      minimum_price:
 *        $ref: '#/definitions/PeerplaysAssetType'
 *      maximum_price:
 *        $ref: '#/definitions/PeerplaysAssetType'
 *      buying_item:
 *        type: boolean
 *      offer_expiration_date:
 *        type: integer
 *        example: 1608897600
 *  BidRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - bidder
 *      - bid_price
 *      - offer_id
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - bid
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      bidder:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      bid_price:
 *        $ref: '#/definitions/PeerplaysAssetType'
 *      offer_id:
 *        type: string
 *        pattern: '^(1.29.)\d+$'
 *        example: 1.29.0
 *  CancelOfferRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - issuer
 *      - offer_id
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - cancel_offer
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      issuer:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      offer_id:
 *        type: string
 *        pattern: '^(1.29.)\d+$'
 *        example: 1.29.0
 *  NftLotteryPurchaseRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - lottery_id
 *      - buyer
 *      - tickets_to_buy
 *      - amount
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - nft_lottery_token_purchase
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      lottery_id:
 *        type: string
 *        pattern: '^(1.30.)\d+$'
 *        example: 1.30.0
 *      buyer:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      tickets_to_buy:
 *        $ref: '#/definitions/PeerplaysAmountType'
 *      amount:
 *        $ref: '#/definitions/PeerplaysAssetType'
 *  OperationRequest:
 *    oneOf:
 *      - $ref: '#/definitions/TransferRequest'
 *      - $ref: '#/definitions/NftCreateRequest'
 *      - $ref: '#/definitions/NftUpdateRequest'
 *      - $ref: '#/definitions/NftMintRequest'
 *      - $ref: '#/definitions/NftSafeTransferRequest'
 *      - $ref: '#/definitions/NftApproveRequest'
 *      - $ref: '#/definitions/NftApproveAllRequest'
 *      - $ref: '#/definitions/OfferRequest'
 *      - $ref: '#/definitions/BidRequest'
 *      - $ref: '#/definitions/CancelOfferRequest'
 *      - $ref: '#/definitions/NftLotteryPurchaseRequest'
 *  OperationsRequest:
 *    type: object
 *    required:
 *      - operations
 *    properties:
 *      operations:
 *        type: array
 *        items:
 *          $ref: '#/definitions/OperationRequest'
 *  TransactionObject:
 *    type: object
 *    required:
 *      - ref_block_num
 *      - ref_block_prefix
 *      - expiration
 *      - operations
 *      - signatures
 *    properties:
 *      ref_block_num:
 *        type: integer
 *      ref_block_prefix:
 *        type: integer
 *      expiration:
 *        type: string
 *        format: date
 *      operations:
 *        type: array
 *        items:
 *          type: array
 *          items: {}
 *          example:
 *            - 0
 *            - fee:
 *                amount: '2000000'
 *                asset_id: 1.3.0
 *              from: 1.2.67
 *              to: 1.2.57
 *              amount:
 *                amount: '100'
 *                asset_id: 1.3.0
 *              extensions: []
 *      operation_result:
 *        type: array
 *        items:
 *          type: integer
 *  TransactionResponse:
 *    allOf:
 *      - $ref: '#/definitions/SuccessResponse'
 *      - type: object
 *        properties:
 *          result:
 *            $ref: '#/definitions/TransactionObject'
 */
const peerplaysAccountIdType = Joi.string().trim().regex(/^(1.2.)\d+$/);
const peerplaysAmountType = Joi.number().integer().max(1000000000000);
const peerplaysAssetIdType = Joi.string().trim().regex(/^(1.3.)\d+$/);
const peerplaysAssetType = Joi.object({
  amount: peerplaysAmountType.required(),
  asset_id: peerplaysAssetIdType.required()
});

const transferSchema = Joi.object({
  op_name: 'transfer',
  fee_asset: peerplaysAssetIdType.required(),
  from: peerplaysAccountIdType.required(),
  to: peerplaysAccountIdType.required(),
  amount: peerplaysAssetType.required(),
  memo: Joi.string().max(100).optional()
});

const nftCreateSchema = Joi.object({
  op_name: 'nft_metadata_create',
  fee_asset: peerplaysAssetIdType.required(),
  owner: peerplaysAccountIdType.required(),
  name: Joi.string().required(),
  symbol: Joi.string().required(),
  base_uri: Joi.string().required(),
  revenue_partner: peerplaysAccountIdType.optional(),
  revenue_split: Joi.number().integer().max(10000).optional(),
  is_transferable: Joi.bool().required(),
  is_sellable: Joi.bool().required(),
  account_role: Joi.string().trim().regex(/^(1.32.)\d+$/).optional(),
  max_supply: peerplaysAmountType.optional(),
  lottery_options: Joi.object({
    benefactors: Joi.array().items(Joi.object({
      id: peerplaysAccountIdType.required(),
      share: Joi.number().integer().max(10000).required()
    })).required(),
    winning_tickets: Joi.array().items(Joi.number().max(10000)).required(),
    ticket_price: peerplaysAssetType.required(),
    end_date: Joi.date().timestamp().required(),
    ending_on_soldout: Joi.bool().required(),
    is_active: Joi.bool().required(),
    delete_tickets_after_draw: Joi.bool().required(),
    progressive_jackpots: Joi.array().items(Joi.string().trim().regex(/^(1.30.)\d+$/)).required()
  }).optional()
});

const nftUpdateSchema = Joi.object({
  op_name: 'nft_metadata_update',
  fee_asset: peerplaysAssetIdType.required(),
  owner: peerplaysAccountIdType.required(),
  nft_metadata_id: Joi.string().trim().regex(/^(1.30.)\d+$/).required(),
  name: Joi.string().optional(),
  symbol: Joi.string().optional(),
  base_uri: Joi.string().optional(),
  revenue_partner: peerplaysAccountIdType.optional(),
  revenue_split: Joi.number().integer().max(10000).optional(),
  is_transferable: Joi.bool().optional(),
  is_sellable: Joi.bool().optional(),
  account_role: Joi.string().trim().regex(/^(1.32.)\d+$/).optional()
});

const nftMintSchema = Joi.object({
  op_name: 'nft_mint',
  fee_asset: peerplaysAssetIdType.required(),
  payer: peerplaysAccountIdType.required(),
  nft_metadata_id: Joi.string().trim().regex(/^(1.30.)\d+$/).required(),
  owner: peerplaysAccountIdType.required(),
  approved: peerplaysAccountIdType.required(),
  approved_operators: Joi.array().items(peerplaysAccountIdType).required(),
  token_uri: Joi.string().required()
});

const nftSafeTransferSchema = Joi.object({
  op_name: 'nft_safe_transfer_from',
  fee_asset: peerplaysAssetIdType.required(),
  operator_: peerplaysAccountIdType.required(),
  from: peerplaysAccountIdType.required(),
  to: peerplaysAccountIdType.required(),
  token_id: Joi.string().trim().regex(/^(1.31.)\d+$/).required(),
  data: Joi.string().required()
});

const nftApproveSchema = Joi.object({
  op_name: 'nft_approve',
  fee_asset: peerplaysAssetIdType.required(),
  operator_: peerplaysAccountIdType.required(),
  approved: peerplaysAccountIdType.required(),
  token_id: Joi.string().trim().regex(/^(1.31.)\d+$/).required()
});

const nftApproveAllSchema = Joi.object({
  op_name: 'nft_set_approval_for_all',
  fee_asset: peerplaysAssetIdType.required(),
  owner: peerplaysAccountIdType.required(),
  operator_: peerplaysAccountIdType.required(),
  approved: Joi.bool().required()
});

const offerSchema = Joi.object({
  op_name: 'offer',
  fee_asset: peerplaysAssetIdType.required(),
  item_ids: Joi.array().items(Joi.string().trim().regex(/^(1.31.)\d+$/)).required(),
  issuer: peerplaysAccountIdType.required(),
  minimum_price: peerplaysAssetType.required(),
  maximum_price: peerplaysAssetType.required(),
  buying_item: Joi.bool().required(),
  offer_expiration_date: Joi.date().timestamp().required()
});

const bidSchema = Joi.object({
  op_name: 'bid',
  fee_asset: peerplaysAssetIdType.required(),
  bidder: peerplaysAccountIdType.required(),
  bid_price: peerplaysAssetType.required(),
  offer_id: Joi.string().trim().regex(/^(1.29.)\d+$/).required()
});

const cancelOfferSchema = Joi.object({
  op_name: 'cancel_offer',
  fee_asset: peerplaysAssetIdType.required(),
  issuer: peerplaysAccountIdType.required(),
  offer_id: Joi.string().trim().regex(/^(1.29.)\d+$/).required()
});

const nftLotteryPurchaseSchema = Joi.object({
  op_name: 'nft_lottery_token_purchase',
  fee_asset: peerplaysAssetIdType.required(),
  lottery_id: Joi.string().trim().regex(/^(1.30.)\d+$/).required(),
  buyer: peerplaysAccountIdType.required(),
  tickets_to_buy: peerplaysAmountType.required(),
  amount: peerplaysAssetType.required()
});

const limitOrderCreateSchema = Joi.object({
  op_name: 'limit_order_create',
  fee_asset: peerplaysAssetIdType.required(),
  seller: peerplaysAccountIdType.required(),
  amount_to_sell: peerplaysAssetType.required(),
  min_to_receive: peerplaysAssetType.required(),
  expiration: Joi.date().timestamp().required(),
  fill_or_kill: Joi.bool().required()
});

const limitOrderCancelSchema = Joi.object({
  op_name: 'limit_order_cancel',
  fee_asset: peerplaysAssetIdType.required(),
  fee_paying_account: peerplaysAccountIdType.required(),
  order: Joi.string().trim().regex(/^(1.7.)\d+$/).required()
});

const callOrderUpdateSchema = Joi.object({
  op_name: 'call_order_update',
  fee_asset: peerplaysAssetIdType.required(),
  funding_account: peerplaysAccountIdType.required(),
  delta_collateral: peerplaysAssetType.required(),
  delta_debt: peerplaysAssetType.required()
});

const fillOrderSchema = Joi.object({
  op_name: 'fill_order',
  fee_asset: peerplaysAssetIdType.required(),
  order_id: Joi.string().trim().regex(/^(1.8.)\d+$/).required(),
  account_id: peerplaysAccountIdType.required(),
  pays: peerplaysAssetType.required(),
  receives: peerplaysAssetType.required()
});

const authoritySchema = Joi.object({
  weight_threshold: Joi.number().integer().required(),
  account_auths: Joi.array().items(Joi.array().length(2).items(peerplaysAccountIdType, Joi.number().integer())).required(),
  key_auths: Joi.array().items(Joi.array().length(2).items(Joi.string(), Joi.number().integer())).required(),
  address_auths: Joi.array().items(Joi.array().length(2).items(Joi.string(), Joi.number().integer())).required()
});

const accountOptionsSchema = Joi.object({
  memo_key: Joi.string().required(),
  voting_account: peerplaysAccountIdType.required(),
  num_witness: Joi.number().integer().required(),
  num_committee: Joi.number().integer().required(),
  num_son: Joi.number().integer().required(),
  votes: Joi.array().items(Joi.number().integer()).required()
});

const accountCreateSchema = Joi.object({
  op_name: 'account_create',
  fee_asset: peerplaysAssetIdType.required(),
  registrar: peerplaysAccountIdType.required(),
  referrer: peerplaysAccountIdType.required(),
  referrer_percent: Joi.number().integer().max(10000).required(),
  name: Joi.string().required(),
  owner: authoritySchema.required(),
  active: authoritySchema.required(),
  options: accountOptionsSchema.required()
});

const accountUpdateSchema = Joi.object({
  op_name: 'account_create',
  fee_asset: peerplaysAssetIdType.required(),
  account: peerplaysAccountIdType.required(),
  owner: authoritySchema.optional(),
  active: authoritySchema.optional(),
  new_options: accountOptionsSchema.optional(),
  update_last_voting_time: Joi.bool().required()
});

const accountWhitelistSchema = Joi.object({
  op_name: 'account_whitelist',
  fee_asset: peerplaysAssetIdType.required(),
  authorizing_account: peerplaysAccountIdType.required(),
  account_to_list: peerplaysAccountIdType.required(),
  new_listing: Joi.number().integer().required()
});

const accountUpgradeSchema = Joi.object({
  op_name: 'account_upgrade',
  fee_asset: peerplaysAssetIdType.required(),
  account_to_upgrade: peerplaysAccountIdType.required(),
  upgrade_to_lifetime_member: Joi.bool().required()
});

const accountTransferSchema = Joi.object({
  op_name: 'account_transfer',
  fee_asset: peerplaysAssetIdType.required(),
  account_id: peerplaysAccountIdType.required(),
  new_owner: peerplaysAccountIdType.required()
});

const priceSchema = Joi.object({
  base: peerplaysAssetType.required(),
  quote: peerplaysAssetType.required()
});

const assetOptionsSchema = Joi.object({
  max_supply: Joi.number().integer().required(),
  market_fee_percent: Joi.number().integer().required(),
  max_market_fee: Joi.number().integer().required(),
  issuer_permissions: Joi.number().integer().required(),
  flags: Joi.number().integer().required(),
  core_exchange_rate: priceSchema.required(),
  whitelist_authorities: Joi.array().items(peerplaysAccountIdType).required(),
  blacklist_authorities: Joi.array().items(peerplaysAccountIdType).required(),
  whitelist_markets: Joi.array().items(peerplaysAssetIdType).required(),
  blacklist_markets: Joi.array().items(peerplaysAssetIdType).required(),
  description: Joi.string().required()
});

const bitassetOptionsSchema = Joi.object({
  feed_lifetime_sec: Joi.number().integer().required(),
  minimum_feeds: Joi.number().integer().required(),
  force_settlement_delay_sec: Joi.number().integer().required(),
  force_settlement_offset_percent: Joi.number().integer().required(),
  maximum_force_settlement_volume: Joi.number().integer().required(),
  short_backing_asset: peerplaysAssetIdType.required()
});

const lotteryAssetOptionsSchema = Joi.object({
  benefactors: Joi.array().items(Joi.object({
    id: peerplaysAccountIdType.required(),
    share: Joi.number().integer().max(10000).required()
  })).required(),
  owner: peerplaysAssetIdType.required(),
  winning_tickets: Joi.array().items(Joi.number().max(10000)).required(),
  ticket_price: peerplaysAssetType.required(),
  end_date: Joi.date().timestamp().required(),
  ending_on_soldout: Joi.bool().required(),
  is_active: Joi.bool().required()
});

const assetCreateSchema = Joi.object({
  op_name: 'asset_create',
  fee_asset: peerplaysAssetIdType.required(),
  issuer: peerplaysAccountIdType.required(),
  symbol: Joi.string().max(10).required(),
  precision: Joi.number().integer().min(0).max(10).required(),
  common_options: assetOptionsSchema.required(),
  bitasset_opts: bitassetOptionsSchema.optional(),
  is_prediction_market: Joi.bool().required()
});

const assetUpdateSchema = Joi.object({
  op_name: 'asset_update',
  fee_asset: peerplaysAssetIdType.required(),
  issuer: peerplaysAccountIdType.required(),
  asset_to_update: peerplaysAssetIdType.required(),
  new_issuer: peerplaysAccountIdType.optional(),
  new_options: assetOptionsSchema.required()
});

const assetUpdateBitassetSchema = Joi.object({
  op_name: 'asset_update_bitasset',
  fee_asset: peerplaysAssetIdType.required(),
  issuer: peerplaysAccountIdType.required(),
  asset_to_update: peerplaysAssetIdType.required(),
  new_options: assetOptionsSchema.required()
});

const assetUpdateFeedProducerSchema = Joi.object({
  op_name: 'asset_update_feed_producers',
  fee_asset: peerplaysAssetIdType.required(),
  issuer: peerplaysAccountIdType.required(),
  asset_to_update: peerplaysAssetIdType.required(),
  new_feed_producers: peerplaysAccountIdType.required()
});

const assetIssueSchema = Joi.object({
  op_name: 'asset_issue',
  fee_asset: peerplaysAssetIdType.required(),
  issuer: peerplaysAccountIdType.required(),
  asset_to_issue: peerplaysAssetType.required(),
  issue_to_account: peerplaysAccountIdType.required()
});

const assetReserveSchema = Joi.object({
  op_name: 'asset_reserve',
  fee_asset: peerplaysAssetIdType.required(),
  payer: peerplaysAccountIdType.required(),
  amount_to_reserve: peerplaysAssetType.required()
});

const assetFundFeePoolSchema = Joi.object({
  op_name: 'asset_fund_fee_pool',
  fee_asset: peerplaysAssetIdType.required(),
  from_account: peerplaysAccountIdType.required(),
  asset_id: peerplaysAssetIdType.required(),
  amount: peerplaysAmountType.required()
});

const assetSettleSchema = Joi.object({
  op_name: 'asset_settle',
  fee_asset: peerplaysAssetIdType.required(),
  account: peerplaysAccountIdType.required(),
  amount: peerplaysAmountType.required()
});

const assetGlobalSettleSchema = Joi.object({
  op_name: 'asset_global_settle',
  fee_asset: peerplaysAssetIdType.required(),
  issuer: peerplaysAccountIdType.required(),
  asset_to_settle: peerplaysAssetIdType.required(),
  settle_price: priceSchema.required()
});

const assetPublishFeedSchema = Joi.object({
  op_name: 'asset_publish_feed',
  fee_asset: peerplaysAssetIdType.required(),
  publisher: peerplaysAccountIdType.required(),
  asset_id: peerplaysAssetIdType.required(),
  feed: Joi.object({
    settle_price: priceSchema.required(),
    maintenance_collateral_ratio: Joi.number().integer().required(),
    maximum_short_squeeze_ratio: Joi.number().integer().required(),
    core_exchange_rate: priceSchema.required()
  }).required()
});

const witnessCreateSchema = Joi.object({
  op_name: 'witness_create',
  fee_asset: peerplaysAssetIdType.required(),
  witness_account: peerplaysAccountIdType.required(),
  url: Joi.string().uri().required(),
  block_signing_key: Joi.string().required(),
  initial_secret: Joi.string().base64().required()
});

const witnessUpdateSchema = Joi.object({
  op_name: 'witness_update',
  fee_asset: peerplaysAssetIdType.required(),
  witness: Joi.string().trim().regex(/^(1.6.)\d+$/).required(),
  witness_account: peerplaysAccountIdType.required(),
  new_url: Joi.string().uri().optional(),
  new_signing_key: Joi.string().optional(),
  new_initial_secret: Joi.string().base64().optional()
});

const proposalCreateSchema = Joi.object({
  op_name: 'proposal_create',
  fee_asset: peerplaysAssetIdType.required(),
  fee_paying_account: peerplaysAccountIdType.required(),
  expiration_time: Joi.date().timestamp().required(),
  proposed_ops: Joi.array().items(Joi.object()),
  review_period_seconds: Joi.number().integer().optional()
});

const proposalUpdateSchema = Joi.object({
  op_name: 'proposal_update',
  fee_asset: peerplaysAssetIdType.required(),
  fee_paying_account: peerplaysAccountIdType.required(),
  proposal: Joi.string().trim().regex(/^(1.10.)\d+$/).required(),
  active_approvals_to_add: peerplaysAccountIdType.required(),
  active_approvals_to_remove: peerplaysAccountIdType.required(),
  owner_approvals_to_add: peerplaysAccountIdType.required(),
  owner_approvals_to_remove: peerplaysAccountIdType.required(),
  key_approvals_to_add: Joi.string().required(),
  key_approvals_to_remove: Joi.string().required()
});

const proposalDeleteSchema = Joi.object({
  op_name: 'proposal_delete',
  fee_asset: peerplaysAssetIdType.required(),
  fee_paying_account: peerplaysAccountIdType.required(),
  using_owner_authority: Joi.bool().required(),
  proposal: Joi.string().trim().regex(/^(1.10.)\d+$/).required()
});

const withdrawPermissionCreateSchema = Joi.object({
  op_name: 'withdraw_permission_create',
  fee_asset: peerplaysAssetIdType.required(),
  withdraw_from_account: peerplaysAccountIdType.required(),
  authorized_account: peerplaysAccountIdType.required(),
  withdrawal_limit: peerplaysAssetType.required(),
  withdrawal_period_sec: Joi.number().integer().required(),
  periods_until_expiration: Joi.number().integer().required(),
  period_start_time: Joi.date().timestamp().required()
});

const withdrawPermissionUpdateSchema = Joi.object({
  op_name: 'withdraw_permission_update',
  fee_asset: peerplaysAssetIdType.required(),
  withdraw_from_account: peerplaysAccountIdType.required(),
  authorized_account: peerplaysAccountIdType.required(),
  permission_to_update: Joi.string().trim().regex(/^(1.12.)\d+$/).required(),
  withdrawal_limit: peerplaysAssetType.required(),
  withdrawal_period_sec: Joi.number().integer().required(),
  periods_until_expiration: Joi.number().integer().required(),
  period_start_time: Joi.date().timestamp().required()
});

const withdrawPermissionClaimSchema = Joi.object({
  op_name: 'withdraw_permission_claim',
  fee_asset: peerplaysAssetIdType.required(),
  withdraw_permission: Joi.string().trim().regex(/^(1.12.)\d+$/).required(),
  withdraw_from_account: peerplaysAccountIdType.required(),
  withdraw_to_account: peerplaysAccountIdType.required(),
  amount_to_withdraw: peerplaysAssetType.required()
});

const withdrawPermissionDeleteSchema = Joi.object({
  op_name: 'withdraw_permission_delete',
  fee_asset: peerplaysAssetIdType.required(),
  withdraw_permission: Joi.string().trim().regex(/^(1.12.)\d+$/).required(),
  withdraw_from_account: peerplaysAccountIdType.required(),
  authorized_account: peerplaysAccountIdType.required()
});

const committeeMemberCreateSchema = Joi.object({
  op_name: 'committee_member_create',
  fee_asset: peerplaysAssetIdType.required(),
  committee_member_account: peerplaysAccountIdType.required(),
  url: Joi.string().required()
});

const committeeMemberUpdateSchema = Joi.object({
  op_name: 'committee_member_update',
  fee_asset: peerplaysAssetIdType.required(),
  committee_member: Joi.string().trim().regex(/^(1.5.)\d+$/).required(),
  committee_member_account: peerplaysAccountIdType.required(),
  new_url: Joi.string().optional()
});

const committeeMemberUpdateGlobalParameters = Joi.object({
  op_name: 'committee_member_update_global_parameters',
  fee_asset: peerplaysAssetIdType.required(),
  new_parameters: Joi.object().required()
});

const vestingBalanceCreateSchema = Joi.object({
  op_name: 'vesting_balance_create',
  fee_asset: peerplaysAssetIdType.required(),
  creator: peerplaysAccountIdType.required(),
  owner: peerplaysAccountIdType.required(),
  amount: peerplaysAssetType.required(),
  policy: Joi.array().length(2).items(Joi.number().integer(), Joi.object()).required(),
  balance_type: Joi.string().valid('normal', 'gpos', 'son').required()
});

const vestingBalanceWithdrawSchema = Joi.object({
  op_name: 'vesting_balance_withdraw',
  fee_asset: peerplaysAssetIdType.required(),
  vesting_balance: Joi.string().trim().regex(/^(1.13.)\d+$/).required(),
  owner: peerplaysAccountIdType.required(),
  amount: peerplaysAssetType.required()
});

const workerCreateSchema = Joi.object({
  op_name: 'worker_create',
  fee_asset: peerplaysAssetIdType.required(),
  owner: peerplaysAccountIdType.required(),
  work_begin_date: Joi.date().timestamp().required(),
  work_end_date: Joi.date().timestamp().required(),
  daily_pay: Joi.number().integer().required(),
  name: Joi.string().required(),
  url: Joi.string().required(),
  initializer: Joi.array().length(2).items(Joi.number().integer(), Joi.object()).required()
});

const customSchema = Joi.object({
  op_name: 'custom',
  fee_asset: peerplaysAssetIdType.required(),
  payer: peerplaysAccountIdType.required(),
  required_auths: Joi.array().items(peerplaysAccountIdType).required(),
  id: Joi.number().integer().required(),
  data: Joi.string().base64().required()
});

const assertSchema = Joi.object({
  op_name: 'assert',
  fee_asset: peerplaysAssetIdType.required(),
  fee_paying_account: peerplaysAccountIdType.required(),
  predicates: Joi.array().items(Joi.array().length(2).items(Joi.number().integer(), Joi.object())).required(),
  required_auths: Joi.array().items(peerplaysAccountIdType).required()
});

const balanceClaimSchema = Joi.object({
  op_name: 'balance_claim',
  fee_asset: peerplaysAssetIdType.required(),
  deposit_to_account: peerplaysAccountIdType.required(),
  balance_to_claim: Joi.string().trim().regex(/^(1.15.)\d+$/).required(),
  balance_owner_key: Joi.string().required(),
  total_claimed: peerplaysAssetType.required()
});

const overrideTransferSchema = Joi.object({
  op_name: 'override_transfer',
  fee_asset: peerplaysAssetIdType.required(),
  issuer: peerplaysAccountIdType.required(),
  from: peerplaysAccountIdType.required(),
  to: peerplaysAccountIdType.required(),
  amount: peerplaysAssetType.required()
});

const stealthConfirmationSchema = Joi.object({
  one_time_key: Joi.string().required(),
  to: Joi.string().optional(),
  encrypted_memo: Joi.string().base64().required()
});

const blindOutputSchema = Joi.object({
  commitment: Joi.string().base64().required(),
  range_proof: Joi.string().base64().required(),
  owner: authoritySchema.required(),
  stealth_memo: stealthConfirmationSchema.optional()
});

const transferToBlindSchema = Joi.object({
  op_name: 'transfer_to_blind',
  fee_asset: peerplaysAssetIdType.required(),
  amount: peerplaysAssetType.required(),
  from: peerplaysAccountIdType.required(),
  blinding_factor: Joi.string().base64().required(),
  outputs: Joi.array().items(blindOutputSchema).required()
});

const blindInputSchema = Joi.object({
  commitment: Joi.string().base64().required(),
  owner: authoritySchema.required()
});

const blindTransferSchema = Joi.object({
  op_name: 'blind_transfer',
  fee_asset: peerplaysAssetIdType.required(),
  inputs: Joi.array().items(blindInputSchema).required(),
  outputs: Joi.array().items(blindOutputSchema).required()
});

const transferFromBlindSchema = Joi.object({
  op_name: 'transfer_from_blind',
  fee_asset: peerplaysAssetIdType.required(),
  amount: peerplaysAssetType.required(),
  to: peerplaysAccountIdType.required(),
  blinding_factor: Joi.string().base64().required(),
  inputs: Joi.array().items(blindInputSchema).required()
});

const assetSettleCancelSchema = Joi.object({
  op_name: 'asset_settle_cancel',
  fee_asset: peerplaysAssetIdType.required(),
  settlement: Joi.string().trim().regex(/^(1.4.)\d+$/).required(),
  account: peerplaysAccountIdType.required(),
  amount: peerplaysAssetType.required()
});

const assetClaimFeesSchema = Joi.object({
  op_name: 'asset_claim_fees',
  fee_asset: peerplaysAssetIdType.required(),
  issuer: peerplaysAccountIdType.required(),
  amount_to_claim: peerplaysAssetType.required()
});

const fbaDistributeSchema = Joi.object({
  op_name: 'fba_distribute',
  fee_asset: peerplaysAssetIdType.required(),
  account_id: peerplaysAccountIdType.required(),
  fba_id: Joi.string().trim().regex(/^(2.16.)\d+$/).required(),
  amount: peerplaysAmountType.required()
});

const rockPaperScissorsGameOptionsSchema = Joi.object({
  insurance_enabled: Joi.bool().required(),
  time_per_commit_move: Joi.number().integer().required(),
  time_per_reveal_move: Joi.number().integer().required(),
  number_of_gestures: Joi.number().integer().required()
});

const tournamentOptionsSchema = Joi.object({
  type_of_game: Joi.number().integer().required(),
  registration_deadline: Joi.date().timestamp().required(),
  number_of_players: Joi.number().integer().required(),
  buy_in: peerplaysAssetType.required(),
  whitelist: Joi.array().items(peerplaysAccountIdType).required(),
  start_time: Joi.date().timestamp().optional(),
  start_delay: Joi.number().integer().required(),
  round_delay: Joi.number().integer().required(),
  number_of_wins: Joi.number().integer().required(),
  meta: Joi.object().required(),
  game_options: Joi.array().length(2).items(Joi.number().integer(), rockPaperScissorsGameOptionsSchema).required()
});

const tournamentCreateSchema = Joi.object({
  op_name: 'tournament_create',
  fee_asset: peerplaysAssetIdType.required(),
  creator: peerplaysAccountIdType.required(),
  options: tournamentOptionsSchema.required()
});

const tournamentJoinSchema = Joi.object({
  op_name: 'tournament_join',
  fee_asset: peerplaysAssetIdType.required(),
  payer_account_id: peerplaysAccountIdType.required(),
  player_account_id: peerplaysAccountIdType.required(),
  tournament_id: Joi.string().trim().regex(/^(1.16.)\d+$/).required(),
  buy_in: peerplaysAssetType.required()
});

const gameMoveSchema = Joi.object({
  op_name: 'game_move',
  fee_asset: peerplaysAssetIdType.required(),
  game_id: Joi.string().trim().regex(/^(1.19.)\d+$/).required(),
  player_account_id: peerplaysAccountIdType.required(),
  move: Joi.array().length(2).items(Joi.number().integer(), Joi.object()).required()
});

const assetUpdateDividendSchema = Joi.object({
  op_name: 'asset_update_dividend',
  fee_asset: peerplaysAssetIdType.required(),
  issuer: peerplaysAccountIdType.required(),
  asset_to_update: peerplaysAssetIdType.required(),
  new_options: Joi.object({
    next_payout_time: Joi.date().timestamp().optional(),
    payout_interval: Joi.number().integer().optional(),
    minimum_fee_percentage: Joi.number().integer().required(),
    minimum_distribution_interval: Joi.number().integer().optional()
  })
});

const assetDividendDistributionSchema = Joi.object({
  op_name: 'asset_dividend_distribution',
  fee_asset: peerplaysAssetIdType.required(),
  dividend_asset_id: peerplaysAssetIdType.required(),
  account_id: peerplaysAccountIdType.required(),
  amounts: Joi.array().items(peerplaysAssetType).min(1).required()
});

const sportCreateSchema = Joi.object({
  op_name: 'sport_create',
  fee_asset: peerplaysAssetIdType.required(),
  name: Joi.array().items(Joi.array().length(2).items(Joi.string(),Joi.string())).required()
});

const sportUpdateSchema = Joi.object({
  op_name: 'sport_update',
  fee_asset: peerplaysAssetIdType.required(),
  sport_id: Joi.string().trim().regex(/^(1.20.)\d+$/).required(),
  new_name: Joi.array().items(Joi.array().length(2).items(Joi.string(),Joi.string())).optional()
});

const eventGroupCreateSchema = Joi.object({
  op_name: 'event_group_create',
  fee_asset: peerplaysAssetIdType.required(),
  name: Joi.array().items(Joi.array().length(2).items(Joi.string(),Joi.string())).required(),
  sport_id: Joi.string().trim().regex(/^(1.20.)\d+$/).required()
});

const eventGroupUpdateSchema = Joi.object({
  op_name: 'event_group_update',
  fee_asset: peerplaysAssetIdType.required(),
  new_name: Joi.array().items(Joi.array().length(2).items(Joi.string(),Joi.string())).optional(),
  new_sport_id: Joi.string().trim().regex(/^(1.20.)\d+$/).optional(),
  event_group_id: Joi.string().trim().regex(/^(1.21.)\d+$/).optional()
});

const eventCreateSchema = Joi.object({
  op_name: 'event_create',
  fee_asset: peerplaysAssetIdType.required(),
  name: Joi.array().items(Joi.array().length(2).items(Joi.string(),Joi.string())).required(),
  season: Joi.array().items(Joi.array().length(2).items(Joi.string(),Joi.string())).required(),
  start_time: Joi.date().timestamp().optional(),
  event_group_id: Joi.string().trim().regex(/^(1.21.)\d+$/).required()
});

const eventUpdateSchema = Joi.object({
  op_name: 'event_update',
  fee_asset: peerplaysAssetIdType.required(),
  event_id: Joi.string().trim().regex(/^(1.22.)\d+$/).required(),
  new_name: Joi.array().items(Joi.array().length(2).items(Joi.string(),Joi.string())).optional(),
  new_season: Joi.array().items(Joi.array().length(2).items(Joi.string(),Joi.string())).optional(),
  new_start_time: Joi.date().timestamp().optional(),
  new_event_group_id: Joi.string().trim().regex(/^(1.21.)\d+$/).optional(),
  is_live_market: Joi.bool().optional()
});

const bettingMarketRulesCreateSchema = Joi.object({
  op_name: 'betting_market_rules_create',
  fee_asset: peerplaysAssetIdType.required(),
  name: Joi.array().items(Joi.array().length(2).items(Joi.string(),Joi.string())).required(),
  description: Joi.array().items(Joi.array().length(2).items(Joi.string(),Joi.string())).required()
});

const bettingMarketRulesUpdateSchema = Joi.object({
  op_name: 'betting_market_rules_update',
  fee_asset: peerplaysAssetIdType.required(),
  new_name: Joi.array().items(Joi.array().length(2).items(Joi.string(),Joi.string())).optional(),
  new_description: Joi.array().items(Joi.array().length(2).items(Joi.string(),Joi.string())).optional(),
  betting_market_rules_id: Joi.string().trim().regex(/^(1.23.)\d+$/).required()
});

const bettingMarketGroupCreateSchema = Joi.object({
  op_name: 'betting_market_group_create',
  fee_asset: peerplaysAssetIdType.required(),
  description: Joi.array().items(Joi.array().length(2).items(Joi.string(),Joi.string())).required(),
  event_id: Joi.string().trim().regex(/^(1.22.)\d+$/).required(),
  rules_id: Joi.string().trim().regex(/^(1.23.)\d+$/).required(),
  asset_id: peerplaysAssetIdType.required()
});

const bettingMarketCreateSchema = Joi.object({
  op_name: 'betting_market_create',
  fee_asset: peerplaysAssetIdType.required(),
  group_id: Joi.string().trim().regex(/^(1.24.)\d+$/).required(),
  description: Joi.array().items(Joi.array().length(2).items(Joi.string(),Joi.string())).required(),
  payout_condition: Joi.array().items(Joi.array().length(2).items(Joi.string(),Joi.string())).required()
});

const betPlaceSchema = Joi.object({
  op_name: 'bet_place',
  fee_asset: peerplaysAssetIdType.required(),
  bettor_id: peerplaysAccountIdType.required(),
  betting_market_id: Joi.string().trim().regex(/^(1.25.)\d+$/).required(),
  amount_to_bet: peerplaysAssetType.required(),
  backer_multiplier: Joi.number().integer().required(),
  back_or_lay: Joi.string().valid('back','lay').required()
});

const resolutionType = Joi.string().valid('win','not_win','cancel','BETTING_MARKET_RESOLUTION_COUNT');

const bettingMarketGroupResolveSchema = Joi.object({
  op_name: 'betting_market_group_resolve',
  fee_asset: peerplaysAssetIdType.required(),
  betting_market_group_id: Joi.string().trim().regex(/^(1.24.)\d+$/).required(),
  resolutions: Joi.array().items(Joi.array().length(2).items(Joi.string().trim().regex(/^(1.25.)\d+$/), resolutionType)).required()
});

const bettingMarketGroupResolvedSchema = Joi.object({
  op_name: 'betting_market_group_resolved',
  fee_asset: peerplaysAssetIdType.required(),
  bettor_id: peerplaysAccountIdType.required(),
  betting_market_group_id: Joi.string().trim().regex(/^(1.24.)\d+$/).required(),
  resolutions: Joi.array().items(Joi.array().length(2).items(Joi.string().trim().regex(/^(1.25.)\d+$/), resolutionType)).required(),
  winnings: peerplaysAmountType.required(),
  fees_paid: peerplaysAmountType.required()
});

const bettingMarketGroupCancelUnmatchedBetsSchema = Joi.object({
  op_name: 'betting_market_group_cancel_unmatched_bets',
  fee_asset: peerplaysAssetIdType.required(),
  betting_market_group_id: Joi.string().trim().regex(/^(1.24.)\d+$/).required()
});

const betMatchedSchema = Joi.object({
  op_name: 'bet_matched',
  bettor_id: peerplaysAccountIdType.required(),
  bet_id: Joi.string().trim().regex(/^(1.26.)\d+$/).required(),
  betting_market_id: Joi.string().trim().regex(/^(1.25.)\d+$/).required(),
  amount_bet: peerplaysAssetType.required(),
  fees_paid: peerplaysAmountType.required(),
  backer_multiplier: Joi.number().integer().required(),
  guaranteed_winnings_returned: peerplaysAmountType.required()
});

const betCancelSchema = Joi.object({
  op_name: 'bet_cancel',
  fee_asset: peerplaysAssetIdType.required(),
  bettor_id: peerplaysAccountIdType.required(),
  bet_to_cancel: Joi.string().trim().regex(/^(1.26.)\d+$/).required()
});

const betCanceledSchema = Joi.object({
  op_name: 'bet_canceled',
  bettor_id: peerplaysAccountIdType.required(),
  bet_id: Joi.string().trim().regex(/^(1.26.)\d+$/).required(),
  stake_returned: peerplaysAssetType.required(),
  unused_fees_returned: peerplaysAssetType.required()
});

const tournamentPayoutSchema = Joi.object({
  op_name: 'tournament_payout',
  fee_asset: peerplaysAssetIdType.required(),
  payout_account_id: peerplaysAccountIdType.required(),
  tournament_id: Joi.string().trim().regex(/^(1.16.)\d+$/).required(),
  payout_amount: peerplaysAssetType.required(),
  type: Joi.string().valid('prize_award', 'buyin_refund', 'rake_fee').required()
});

const tournamentLeaveSchema = Joi.object({
  op_name: 'tournament_leave',
  fee_asset: peerplaysAssetIdType.required(),
  canceling_account_id: peerplaysAccountIdType.required(),
  player_account_id: peerplaysAccountIdType.required(),
  tournament_id: Joi.string().trim().regex(/^(1.16.)\d+$/).required()
});

const bettingMarketGroupUpdateSchema = Joi.object({
  op_name: 'betting_market_group_update',
  fee_asset: peerplaysAssetIdType.required(),
  betting_market_group_id: Joi.string().trim().regex(/^(1.24.)\d+$/).required(),
  new_description: Joi.array().items(Joi.array().length(2).items(Joi.string(),Joi.string())).optional(),
  new_rules_id: Joi.string().trim().regex(/^(1.23.)\d+$/).optional(),
  freeze: Joi.bool().optional(),
  delay_bets: Joi.bool().optional()
});

const bettingMarketUpdateSchema = Joi.object({
  op_name: 'betting_market_update',
  fee_asset: peerplaysAssetIdType.required(),
  betting_market_id: Joi.string().trim().regex(/^(1.24.)\d+$/).required(),
  new_group_id: Joi.string().trim().regex(/^(1.24.)\d+$/).optional(),
  new_description: Joi.array().items(Joi.array().length(2).items(Joi.string(),Joi.string())).optional(),
  new_payout_condition: Joi.array().items(Joi.array().length(2).items(Joi.string(),Joi.string())).optional()
});

const betAdjustedSchema = Joi.object({
  op_name: 'bet_adjusted',
  bettor_id: peerplaysAccountIdType.required(),
  bet_id: Joi.string().trim().regex(/^(1.26.)\d+$/).required(),
  stake_returned: peerplaysAssetType.required()
});

const lotteryAssetCreateSchema = Joi.object({
  op_name: 'lottery_asset_create',
  fee_asset: peerplaysAssetIdType.required(),
  issuer: peerplaysAccountIdType.required(),
  symbol: Joi.string().max(10).required(),
  precision: Joi.number().integer().min(0).max(10).required(),
  common_options: assetOptionsSchema.required(),
  bitasset_opts: bitassetOptionsSchema.optional(),
  is_prediction_market: Joi.bool().required(),
  extensions: lotteryAssetOptionsSchema.required()
});

const ticketPurchaseSchema = Joi.object({
  op_name: 'ticket_purchase',
  fee_asset: peerplaysAssetIdType.required(),
  lottery: peerplaysAssetIdType.required(),
  buyer: peerplaysAccountIdType.required(),
  tickets_to_buy: peerplaysAmountType.required(),
  amount: peerplaysAssetType.required()
});

const lotteryRewardSchema = Joi.object({
  op_name: 'lottery_reward',
  fee_asset: peerplaysAssetIdType.required(),
  lottery: peerplaysAssetIdType.required(),
  winner: peerplaysAccountIdType.required(),
  amount: peerplaysAssetType.required(),
  win_percentage: Joi.number().integer().max(10000).required(),
  is_benefactor_reward: Joi.bool().required()
});

const lotteryEndSchema = Joi.object({
  op_name: 'lottery_end',
  fee_asset: peerplaysAssetIdType.required(),
  lottery: peerplaysAssetIdType.required(),
  participants: Joi.array().items(Joi.array().length(2).items(peerplaysAccountIdType, Joi.number().integer())).required()
});

const sweepsVestingClaimSchema = Joi.object({
  op_name: 'sweeps_vesting_claim',
  account: peerplaysAccountIdType.required(),
  amount_to_claim: peerplaysAssetType.required()
});

const customPermissionCreateSchema = Joi.object({
  op_name: 'custom_permission_create',
  fee_asset: peerplaysAssetIdType.required(),
  owner_account: peerplaysAccountIdType.required(),
  permission_name: Joi.string().max(10).required(),
  auth: authoritySchema
});

const customPermissionUpdateSchema = Joi.object({
  op_name: 'custom_permission_update',
  fee_asset: peerplaysAssetIdType.required(),
  permission_id: Joi.string().trim().regex(/^(1.27.)\d+$/).required(),
  new_auth: authoritySchema,
  owner_account: peerplaysAccountIdType.required()
});

const customPermissionDeleteSchema = Joi.object({
  op_name: 'custom_permission_delete',
  fee_asset: peerplaysAssetIdType.required(),
  permission_id: Joi.string().trim().regex(/^(1.27.)\d+$/).required(),
  owner_account: peerplaysAccountIdType.required()
});

const customAccountAuthorityCreateSchema = Joi.object({
  op_name: 'custom_account_authority_create',
  fee_asset: peerplaysAssetIdType.required(),
  permission_id: Joi.string().trim().regex(/^(1.27.)\d+$/).required(),
  operation_type: Joi.number().integer().min(0).required(),
  valid_from: Joi.date().timestamp().required(),
  valid_to: Joi.date().timestamp().required(),
  owner_account: peerplaysAccountIdType.required()
});

const customAccountAuthorityUpdateSchema = Joi.object({
  op_name: 'custom_account_authority_update',
  fee_asset: peerplaysAssetIdType.required(),
  auth_id: Joi.string().trim().regex(/^(1.28.)\d+$/).required(),
  new_valid_from: Joi.date().timestamp().optional(),
  new_valid_to: Joi.date().timestamp().optional(),
  owner_account: peerplaysAccountIdType.required()
});

const customAccountAuthorityDeleteSchema = Joi.object({
  op_name: 'custom_account_authority_delete',
  fee_asset: peerplaysAssetIdType.required(),
  auth_id: Joi.string().trim().regex(/^(1.28.)\d+$/).required(),
  owner_account: peerplaysAccountIdType.required()
});

const finalizeOfferSchema = Joi.object({
  op_name: 'finalize_offer',
  fee_asset: peerplaysAssetIdType.required(),
  fee_paying_account: peerplaysAccountIdType.required(),
  offer_id: Joi.string().trim().regex(/^(1.28.)\d+$/).required(),
  result: Joi.string().valid('Expired','ExpiredNoBid','Cancelled').required()
});

const accountRoleCreateSchema = Joi.object({
  op_name: 'account_role_create',
  fee_asset: peerplaysAssetIdType.required(),
  owner: peerplaysAccountIdType.required(),
  name: Joi.string().required(),
  metadata: Joi.string().required(),
  allowed_operations: Joi.array().items(Joi.number().integer().min(0)).required(),
  whitelisted_accounts: Joi.array().items(peerplaysAccountIdType).required(),
  valid_from: Joi.date().timestamp().required()
});

const accountRoleUpdateSchema = Joi.object({
  op_name: 'account_role_update',
  fee_asset: peerplaysAssetIdType.required(),
  owner: peerplaysAccountIdType.required(),
  account_role_id: Joi.string().trim().regex(/^(1.32.)\d+$/).required(),
  name: Joi.string().optional(),
  metadata: Joi.string().optional(),
  allowed_operations_to_add: Joi.array().items(Joi.number().integer().min(0)).required(),
  allowed_operations_to_remove: Joi.array().items(Joi.number().integer().min(0)).required(),
  accounts_to_add: Joi.array().items(peerplaysAccountIdType).required(),
  accounts_to_remove: Joi.array().items(peerplaysAccountIdType).required(),
  valid_to: Joi.date().timestamp().optional()
});

const accountRoleDeleteSchema = Joi.object({
  op_name: 'account_role_delete',
  fee_asset: peerplaysAssetIdType.required(),
  owner: peerplaysAccountIdType.required(),
  account_role_id: Joi.string().trim().regex(/^(1.32.)\d+$/).required()
});

const sidechainType = Joi.string().valid(
  'unknown',
  'bitcoin',
  'ethereum',
  'eos',
  'peerplays'
);

const sonCreateSchema = Joi.object({
  op_name: 'son_create',
  fee_asset: peerplaysAssetIdType.required(),
  owner_account: peerplaysAccountIdType.required(),
  url: Joi.string().uri().required(),
  deposit: Joi.string().trim().regex(/^(1.13.)\d+$/).required(),
  signing_key: Joi.string().required(),
  sidechain_public_keys: Joi.array().items(Joi.array().length(2).items(sidechainType, Joi.string())).required(),
  pay_vb: Joi.string().trim().regex(/^(1.13.)\d+$/).required()
});

const sonUpdateSchema = Joi.object({
  op_name: 'son_update',
  fee_asset: peerplaysAssetIdType.required(),
  son_id: Joi.string().trim().regex(/^(1.33.)\d+$/).required(),
  owner_account: peerplaysAccountIdType.required(),
  new_url: Joi.string().uri().optional(),
  new_deposit: Joi.string().trim().regex(/^(1.13.)\d+$/).optional(),
  new_signing_key: Joi.string().optional(),
  new_sidechain_public_keys: Joi.array().items(Joi.array().length(2).items(sidechainType, Joi.string())).optional(),
  new_pay_vb: Joi.string().trim().regex(/^(1.13.)\d+$/).optional()
});

const sonDeregisterSchema = Joi.object({
  op_name: 'son_deregister',
  fee_asset: peerplaysAssetIdType.required(),
  son_id: Joi.string().trim().regex(/^(1.33.)\d+$/).required(),
  payer: peerplaysAccountIdType.required()
});

const sonHeartbeatSchema = Joi.object({
  op_name: 'son_heartbeat',
  fee_asset: peerplaysAssetIdType.required(),
  son_id: Joi.string().trim().regex(/^(1.33.)\d+$/).required(),
  owner_account: peerplaysAccountIdType.required(),
  ts: Joi.date().timestamp().required()
});

const sonReportDownSchema = Joi.object({
  op_name: 'son_report_down',
  fee_asset: peerplaysAssetIdType.required(),
  son_id: Joi.string().trim().regex(/^(1.33.)\d+$/).required(),
  payer: peerplaysAccountIdType.required(),
  down_ts: Joi.date().timestamp().required()
});

const sonMaintenanceSchema = Joi.object({
  op_name: 'son_maintenance',
  fee_asset: peerplaysAssetIdType.required(),
  son_id: Joi.string().trim().regex(/^(1.33.)\d+$/).required(),
  owner_account: peerplaysAccountIdType.required(),
  request_type: Joi.string().valid('request_maintenance','cancel_request_maintenance').required()
});

const sonInfoSchema = Joi.object({
  son_id: Joi.string().trim().regex(/^(1.33.)\d+$/).required(),
  weight: Joi.number().integer().min(0).required(),
  signing_key: Joi.string().required(),
  sidechain_public_keys: Joi.array().items(Joi.array().length(2).items(sidechainType, Joi.string())).required()
});

const sonWalletRecreateSchema = Joi.object({
  op_name: 'son_wallet_recreate',
  fee_asset: peerplaysAssetIdType.required(),
  payer: peerplaysAccountIdType.required(),
  sons: Joi.array().items(sonInfoSchema).min(1).required()
});

const sonWalletUpdateSchema = Joi.object({
  op_name: 'son_wallet_update',
  fee_asset: peerplaysAssetIdType.required(),
  payer: peerplaysAccountIdType.required(),
  son_wallet_id: Joi.string().trim().regex(/^(1.35.)\d+$/).required(),
  sidechain: sidechainType.required(),
  address: Joi.string().required()
});

const sonWalletDepositCreateSchema = Joi.object({
  op_name: 'son_wallet_deposit_create',
  fee_asset: peerplaysAssetIdType.required(),
  payer: peerplaysAccountIdType.required(),
  son_id: Joi.string().trim().regex(/^(1.33.)\d+$/).required(),
  timestamp: Joi.date().timestamp().required(),
  block_num: Joi.number().integer().required(),
  sidechain: sidechainType.required(),
  sidechain_uid: Joi.string().required(),
  sidechain_transaction_id: Joi.string().required(),
  sidechain_from: Joi.string().required(),
  sidechain_to: Joi.string().required(),
  sidechain_currency: Joi.string().required(),
  sidechain_amount: peerplaysAmountType.required(),
  peerplays_from: peerplaysAccountIdType.required(),
  peerplays_to: peerplaysAccountIdType.required(),
  peerplays_asset: peerplaysAssetType.required()
});

const sonWalletDepositProcessSchema = Joi.object({
  op_name: 'son_wallet_deposit_process',
  fee_asset: peerplaysAssetIdType.required(),
  payer: peerplaysAccountIdType.required(),
  son_wallet_deposit_id: Joi.string().trim().regex(/^(1.36.)\d+$/).required()
});

const sonWalletWithdrawCreateSchema = Joi.object({
  op_name: 'son_wallet_withdraw_create',
  fee_asset: peerplaysAssetIdType.required(),
  payer: peerplaysAccountIdType.required(),
  son_id: Joi.string().trim().regex(/^(1.33.)\d+$/).required(),
  timestamp: Joi.date().timestamp().required(),
  block_num: Joi.number().integer().required(),
  sidechain: sidechainType.required(),
  peerplays_uid: Joi.string().required(),
  peerplays_transaction_id: Joi.string().required(),
  peerplays_from: peerplaysAccountIdType.required(),
  peerplays_asset: peerplaysAssetType.required(),
  withdraw_sidechain: sidechainType.required(),
  withdraw_address: Joi.string().required(),
  withdraw_currency: Joi.string().required(),
  withdraw_amount: Joi.number().integer().required()
});

const sonWalletWithdrawProcessSchema = Joi.object({
  op_name: 'son_wallet_withdraw_process',
  fee_asset: peerplaysAssetIdType.required(),
  payer: peerplaysAccountIdType.required(),
  son_wallet_withdraw_id: Joi.string().trim().regex(/^(1.37.)\d+$/).required()
});

const sidechainAddressAddSchema = Joi.object({
  op_name: 'sidechain_address_add',
  fee_asset: peerplaysAssetIdType.required(),
  payer: peerplaysAccountIdType.required(),
  sidechain_address_account: peerplaysAccountIdType.required(),
  sidechain: sidechainType.required(),
  deposit_public_key: Joi.string().required(),
  deposit_address: Joi.string().required(),
  deposit_address_data: Joi.string().required(),
  withdraw_public_key: Joi.string().required(),
  withdraw_address: Joi.string().required()
});

const sidechainAddressUpdateSchema = Joi.object({
  op_name: 'sidechain_address_update',
  fee_asset: peerplaysAssetIdType.required(),
  payer: peerplaysAccountIdType.required(),
  sidechain_address_id: Joi.string().trim().regex(/^(1.38.)\d+$/).required(),
  sidechain_address_account: peerplaysAccountIdType.required(),
  sidechain: sidechainType.required(),
  deposit_public_key: Joi.string().optional(),
  deposit_address: Joi.string().optional(),
  deposit_address_data: Joi.string().optional(),
  withdraw_public_key: Joi.string().optional(),
  withdraw_address: Joi.string().optional()
});

const sidechainAddressDeleteSchema = Joi.object({
  op_name: 'sidechain_address_delete',
  fee_asset: peerplaysAssetIdType.required(),
  payer: peerplaysAccountIdType.required(),
  sidechain_address_id: Joi.string().trim().regex(/^(1.38.)\d+$/).required(),
  sidechain_address_account: peerplaysAccountIdType.required(),
  sidechain: sidechainType.required()
});

const sidechainTransactionCreateSchema = Joi.object({
  op_name: 'sidechain_transaction_create',
  fee_asset: peerplaysAssetIdType.required(),
  payer: peerplaysAccountIdType.required(),
  sidechain: sidechainType.required(),
  object_id: Joi.string().required(),
  transaction: Joi.string().required(),
  signers: Joi.array().items(sonInfoSchema).min(1).required()
});

const sidechainTransactionSignSchema = Joi.object({
  op_name: 'sidechain_transaction_sign',
  fee_asset: peerplaysAssetIdType.required(),
  signer: Joi.string().trim().regex(/^(1.33.)\d+$/).required(),
  payer: peerplaysAccountIdType.required(),
  sidechain_transaction_id: Joi.string().trim().regex(/^(1.39.)\d+$/).required(),
  signature: Joi.string().required()
});

const sidechainTransactionSendSchema = Joi.object({
  op_name: 'sidechain_transaction_send',
  fee_asset: peerplaysAssetIdType.required(),
  payer: peerplaysAccountIdType.required(),
  sidechain_transaction_id: Joi.string().trim().regex(/^(1.39.)\d+$/).required(),
  sidechain_transaction: Joi.string().required()
});

const sidechainTransactionSettleSchema = Joi.object({
  op_name: 'sidechain_transaction_settle',
  fee_asset: peerplaysAssetIdType.required(),
  payer: peerplaysAccountIdType.required(),
  sidechain_transaction_id: Joi.string().trim().regex(/^(1.39.)\d+$/).required()
});

const nftLotteryRewardSchema = Joi.object({
  op_name: 'nft_lottery_reward',
  fee_asset: peerplaysAssetIdType.required(),
  lottery_id: Joi.string().trim().regex(/^(1.30.)\d+$/).required(),
  winner: peerplaysAccountIdType.required(),
  amount: peerplaysAssetType.required(),
  win_percentage: Joi.number().integer().max(10000).required(),
  is_benefactor_reward: Joi.bool().required(),
  winner_ticket_id: Joi.number().integer().required()
});

const nftLotteryEndSchema = Joi.object({
  op_name: 'nft_lottery_end',
  fee_asset: peerplaysAssetIdType.required(),
  lottery_id: Joi.string().trim().regex(/^(1.30.)\d+$/).required()
});

const randomNumberStoreSchema = Joi.object({
  op_name: 'random_number_store',
  fee_asset: peerplaysAssetIdType.required(),
  account: peerplaysAccountIdType.required(),
  random_number: Joi.array().items(Joi.number().integer()).min(1).required(),
  data: Joi.string().required()
});

module.exports = {
  transferSchema,
  limitOrderCreateSchema,
  limitOrderCancelSchema,
  callOrderUpdateSchema,
  fillOrderSchema,
  accountCreateSchema,
  accountUpdateSchema,
  accountWhitelistSchema,
  accountUpgradeSchema,
  accountTransferSchema,
  assetCreateSchema,
  assetUpdateSchema,
  assetUpdateBitassetSchema,
  assetUpdateFeedProducerSchema,
  assetIssueSchema,
  assetReserveSchema,
  assetFundFeePoolSchema,
  assetSettleSchema,
  assetGlobalSettleSchema,
  assetPublishFeedSchema,
  witnessCreateSchema,
  witnessUpdateSchema,
  proposalCreateSchema,
  proposalUpdateSchema,
  proposalDeleteSchema,
  withdrawPermissionCreateSchema,
  withdrawPermissionUpdateSchema,
  withdrawPermissionClaimSchema,
  withdrawPermissionDeleteSchema,
  committeeMemberCreateSchema,
  committeeMemberUpdateSchema,
  committeeMemberUpdateGlobalParameters,
  vestingBalanceCreateSchema,
  vestingBalanceWithdrawSchema,
  workerCreateSchema,
  customSchema,
  assertSchema,
  balanceClaimSchema,
  overrideTransferSchema,
  transferToBlindSchema,
  blindTransferSchema,
  transferFromBlindSchema,
  assetSettleCancelSchema,
  assetClaimFeesSchema,
  fbaDistributeSchema,
  tournamentCreateSchema,
  tournamentJoinSchema,
  gameMoveSchema,
  assetUpdateDividendSchema,
  assetDividendDistributionSchema,
  sportCreateSchema,
  sportUpdateSchema,
  eventGroupCreateSchema,
  eventGroupUpdateSchema,
  eventCreateSchema,
  eventUpdateSchema,
  bettingMarketRulesCreateSchema,
  bettingMarketRulesUpdateSchema,
  bettingMarketGroupCreateSchema,
  bettingMarketCreateSchema,
  betPlaceSchema,
  bettingMarketGroupResolveSchema,
  bettingMarketGroupResolvedSchema,
  bettingMarketGroupCancelUnmatchedBetsSchema,
  betMatchedSchema,
  betCancelSchema,
  betCanceledSchema,
  tournamentPayoutSchema,
  tournamentLeaveSchema,
  bettingMarketGroupUpdateSchema,
  bettingMarketUpdateSchema,
  betAdjustedSchema,
  lotteryAssetCreateSchema,
  ticketPurchaseSchema,
  lotteryRewardSchema,
  lotteryEndSchema,
  sweepsVestingClaimSchema,
  customPermissionCreateSchema,
  customPermissionUpdateSchema,
  customPermissionDeleteSchema,
  customAccountAuthorityCreateSchema,
  customAccountAuthorityUpdateSchema,
  customAccountAuthorityDeleteSchema,
  finalizeOfferSchema,
  accountRoleCreateSchema,
  accountRoleUpdateSchema,
  accountRoleDeleteSchema,
  sonCreateSchema,
  sonUpdateSchema,
  sonDeregisterSchema,
  sonHeartbeatSchema,
  sonReportDownSchema,
  sonMaintenanceSchema,
  sonWalletRecreateSchema,
  sonWalletUpdateSchema,
  sonWalletDepositCreateSchema,
  sonWalletDepositProcessSchema,
  sonWalletWithdrawCreateSchema,
  sonWalletWithdrawProcessSchema,
  sidechainAddressAddSchema,
  sidechainAddressUpdateSchema,
  sidechainAddressDeleteSchema,
  sidechainTransactionCreateSchema,
  sidechainTransactionSignSchema,
  sidechainTransactionSendSchema,
  sidechainTransactionSettleSchema,
  nftCreateSchema,
  nftUpdateSchema,
  nftMintSchema,
  nftSafeTransferSchema,
  nftApproveSchema,
  nftApproveAllSchema,
  offerSchema,
  bidSchema,
  cancelOfferSchema,
  nftLotteryPurchaseSchema,
  nftLotteryRewardSchema,
  nftLotteryEndSchema,
  randomNumberStoreSchema
};
