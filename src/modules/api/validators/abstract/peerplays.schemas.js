const Joi = require('joi');

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

module.exports = {
  transferSchema,
  nftCreateSchema,
  nftUpdateSchema,
  nftMintSchema,
  nftSafeTransferSchema,
  nftApproveSchema,
  nftApproveAllSchema,
  offerSchema,
  bidSchema,
  cancelOfferSchema,
  nftLotteryPurchaseSchema
};
