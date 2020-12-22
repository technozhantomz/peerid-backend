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
 *        $ref: '#/definitions/PeerplaysAssetType'
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
 *      - $ref: '#/definitions/LimitOrderCreateRequest'
 *      - $ref: '#/definitions/LimitOrderCancelRequest'
 *      - $ref: '#/definitions/CallOrderUpdateRequest'
 *      - $ref: '#/definitions/FillOrderRequest'
 *      - $ref: '#/definitions/AccountCreateRequest'
 *      - $ref: '#/definitions/AccountUpdateRequest'
 *      - $ref: '#/definitions/AccountWhitelistRequest'
 *      - $ref: '#/definitions/AccountUpgradeRequest'
 *      - $ref: '#/definitions/AccountTransferRequest'
 *      - $ref: '#/definitions/AssetCreateRequest'
 *      - $ref: '#/definitions/AssetUpdateRequest'
 *      - $ref: '#/definitions/AssetUpdateBitassetRequest'
 *      - $ref: '#/definitions/AssetUpdateFeedProducerRequest'
 *      - $ref: '#/definitions/AssetIssueRequest'
 *      - $ref: '#/definitions/AssetReserveRequest'
 *      - $ref: '#/definitions/AssetFundFeePoolRequest'
 *      - $ref: '#/definitions/AssetSettleRequest'
 *      - $ref: '#/definitions/AssetGlobalSettleRequest'
 *      - $ref: '#/definitions/AssetPublishFeedRequest'
 *      - $ref: '#/definitions/WitnessCreateRequest'
 *      - $ref: '#/definitions/WitnessUpdateRequest'
 *      - $ref: '#/definitions/ProposalCreateRequest'
 *      - $ref: '#/definitions/ProposalUpdateRequest'
 *      - $ref: '#/definitions/ProposalDeleteRequest'
 *      - $ref: '#/definitions/WithdrawPermissionCreateRequest'
 *      - $ref: '#/definitions/WithdrawPermissionUpdateRequest'
 *      - $ref: '#/definitions/WithdrawPermissionClaimRequest'
 *      - $ref: '#/definitions/WithdrawPermissionDeleteRequest'
 *      - $ref: '#/definitions/CommitteeMemberCreateRequest'
 *      - $ref: '#/definitions/CommitteeMemberUpdateRequest'
 *      - $ref: '#/definitions/CommitteeMemberUpdateGlobalParametersRequest'
 *      - $ref: '#/definitions/VestingBalanceCreateRequest'
 *      - $ref: '#/definitions/VestingBalanceWithdrawRequest'
 *      - $ref: '#/definitions/WorkerCreateRequest'
 *      - $ref: '#/definitions/CustomRequest'
 *      - $ref: '#/definitions/AssertRequest'
 *      - $ref: '#/definitions/BalanceClaimRequest'
 *      - $ref: '#/definitions/OverrideTransferRequest'
 *      - $ref: '#/definitions/TransferToBlindRequest'
 *      - $ref: '#/definitions/BlindTransferRequest'
 *      - $ref: '#/definitions/TransferFromBlindRequest'
 *      - $ref: '#/definitions/AssetSettleCancelRequest'
 *      - $ref: '#/definitions/AssetClaimFeesRequest'
 *      - $ref: '#/definitions/FBADistributeRequest'
 *      - $ref: '#/definitions/TournamentCreateRequest'
 *      - $ref: '#/definitions/TournamentJoinRequest'
 *      - $ref: '#/definitions/GameMoveRequest'
 *      - $ref: '#/definitions/AssetUpdateDividendRequest'
 *      - $ref: '#/definitions/AssetDividendDistributionRequest'
 *      - $ref: '#/definitions/TournamentPayoutRequest'
 *      - $ref: '#/definitions/TournamentLeaveRequest'
 *      - $ref: '#/definitions/SportCreateRequest'
 *      - $ref: '#/definitions/SportUpdateRequest'
 *      - $ref: '#/definitions/EventGroupCreateRequest'
 *      - $ref: '#/definitions/EventGroupUpdateRequest'
 *      - $ref: '#/definitions/EventCreateRequest'
 *      - $ref: '#/definitions/EventUpdateRequest'
 *      - $ref: '#/definitions/BettingMarketRulesCreateRequest'
 *      - $ref: '#/definitions/BettingMarketRulesUpdateRequest'
 *      - $ref: '#/definitions/BettingMarketGroupCreateRequest'
 *      - $ref: '#/definitions/BettingMarketCreateRequest'
 *      - $ref: '#/definitions/BetPlaceRequest'
 *      - $ref: '#/definitions/BettingMarketGroupResolveRequest'
 *      - $ref: '#/definitions/BettingMarketGroupResolvedRequest'
 *      - $ref: '#/definitions/BetAdjustedRequest'
 *      - $ref: '#/definitions/BettingMarketGroupCancelUnmatchedBetsRequest'
 *      - $ref: '#/definitions/BetMatchedRequest'
 *      - $ref: '#/definitions/BetCancelRequest'
 *      - $ref: '#/definitions/BetCanceledRequest'
 *      - $ref: '#/definitions/BettingMarketGroupUpdateRequest'
 *      - $ref: '#/definitions/BettingMarketUpdateRequest'
 *      - $ref: '#/definitions/LotteryAssetCreateRequest'
 *      - $ref: '#/definitions/TicketPurchaseRequest'
 *      - $ref: '#/definitions/LotteryRewardRequest'
 *      - $ref: '#/definitions/LotteryEndRequest'
 *      - $ref: '#/definitions/SweepsVestingClaimRequest'
 *      - $ref: '#/definitions/CustomPermissionCreateRequest'
 *      - $ref: '#/definitions/CustomPermissionUpdateRequest'
 *      - $ref: '#/definitions/CustomPermissionDeleteRequest'
 *      - $ref: '#/definitions/CustomAccountAuthorityCreateRequest'
 *      - $ref: '#/definitions/CustomAccountAuthorityUpdateRequest'
 *      - $ref: '#/definitions/CustomAccountAuthorityDeleteRequest'
 *      - $ref: '#/definitions/OfferRequest'
 *      - $ref: '#/definitions/BidRequest'
 *      - $ref: '#/definitions/CancelOfferRequest'
 *      - $ref: '#/definitions/FinalizeOfferRequest'
 *      - $ref: '#/definitions/NftCreateRequest'
 *      - $ref: '#/definitions/NftUpdateRequest'
 *      - $ref: '#/definitions/NftMintRequest'
 *      - $ref: '#/definitions/NftSafeTransferRequest'
 *      - $ref: '#/definitions/NftApproveRequest'
 *      - $ref: '#/definitions/NftApproveAllRequest'
 *      - $ref: '#/definitions/AccountRoleCreateRequest'
 *      - $ref: '#/definitions/AccountRoleUpdateRequest'
 *      - $ref: '#/definitions/AccountRoleDeleteRequest'
 *      - $ref: '#/definitions/SONCreateRequest'
 *      - $ref: '#/definitions/SONUpdateRequest'
 *      - $ref: '#/definitions/SONDeregisterRequest'
 *      - $ref: '#/definitions/SONHeartbeatRequest'
 *      - $ref: '#/definitions/SONReportDownRequest'
 *      - $ref: '#/definitions/SONMaintenanceRequest'
 *      - $ref: '#/definitions/SONWalletRecreateRequest'
 *      - $ref: '#/definitions/SONWalletUpdateRequest'
 *      - $ref: '#/definitions/SONWalletDepositCreateRequest'
 *      - $ref: '#/definitions/SONWalletDepositProcessRequest'
 *      - $ref: '#/definitions/SONWalletWithdrawCreateRequest'
 *      - $ref: '#/definitions/SONWalletWithdrawProcessRequest'
 *      - $ref: '#/definitions/SidechainAddressAddRequest'
 *      - $ref: '#/definitions/SidechainAddressUpdateRequest'
 *      - $ref: '#/definitions/SidechainAddressDeleteRequest'
 *      - $ref: '#/definitions/SidechainTransactionCreateRequest'
 *      - $ref: '#/definitions/SidechainTransactionSignRequest'
 *      - $ref: '#/definitions/SidechainTransactionSendRequest'
 *      - $ref: '#/definitions/SidechainTransactionSettleRequest'
 *      - $ref: '#/definitions/NftLotteryPurchaseRequest'
 *      - $ref: '#/definitions/NftLotteryRewardRequest'
 *      - $ref: '#/definitions/NftLotteryEndRequest'
 *      - $ref: '#/definitions/RandomNumberStoreRequest'
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
 *  LimitOrderCreateRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - seller
 *      - amount_to_sell
 *      - min_to_receive
 *      - expiration
 *      - fill_or_kill
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - limit_order_create
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      seller:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      amount_to_sell:
 *        $ref: '#/definitions/PeerplaysAssetType'
 *      min_to_receive:
 *        $ref: '#/definitions/PeerplaysAssetType'
 *      expiration:
 *        type: integer
 *        example: 160989737
 *      fill_or_kill:
 *        type: boolean
 *  LimitOrderCancelRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - fee_paying_account
 *      - order
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - limit_order_cancel
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      fee_paying_account:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      order:
 *        type: string
 *        pattern: '^(1.7.)\d+$'
 *        example: 1.7.0
 *  CallOrderUpdateRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - funding_account
 *      - delta_collateral
 *      - delta_debt
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - call_order_update
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      funding_account:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      delta_collateral:
 *        $ref: '#/definitions/PeerplaysAssetType'
 *      delta_debt:
 *        $ref: '#/definitions/PeerplaysAssetType'
 *  FillOrderRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - order_id
 *      - account_id
 *      - pays
 *      - receives
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - fill_order
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      order_id:
 *        type: string
 *        pattern: '^(1.7.)\d+$'
 *        example: 1.7.0
 *      account_id:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      pays:
 *        $ref: '#/definitions/PeerplaysAssetType'
 *      receives:
 *        $ref: '#/definitions/PeerplaysAssetType'
 *  AuthorityType:
 *    type: object
 *    required:
 *      - weight_threshold
 *      - account_auths
 *      - key_auths
 *      - address_auths
 *    properties:
 *      weight_threshold:
 *        type: integer
 *        example: 1
 *      account_auths:
 *        type: array
 *        items:
 *          type: array
 *          minItems: 2
 *          maxItems: 2
 *          items: {}
 *          example:
 *            - 1.2.110
 *            - 1
 *      key_auths:
 *        type: array
 *        items:
 *          type: array
 *          minItems: 2
 *          maxItems: 2
 *          items: {}
 *          example:
 *            - 1ljaukl1j839il30sjj2u219ja0js9k2
 *            - 1
 *      address_auths:
 *        type: array
 *        items:
 *          type: array
 *          minItems: 2
 *          maxItems: 2
 *          items: {}
 *          example:
 *            - PPY1ljaukl1j839il30sjj2u219ja0js9k2
 *            - 1
 *  AccountOptionsType:
 *    type: object
 *    required:
 *      - memo_key
 *      - voting_account
 *      - num_witness
 *      - num_committee
 *      - num_son
 *      - votes
 *    properties:
 *      memo_key:
 *        type: string
 *        example: PPYS2a2a30k9jd8jmnd9j3nd99dk3n8ddms
 *      voting_account:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      num_witness:
 *        type: integer
 *        example: 4
 *      num_committee:
 *        type: integer
 *        example: 2
 *      num_son:
 *        type: integer
 *        example: 2
 *      votes:
 *        type: array
 *        items:
 *          type: integer
 *          example: 31
 *  AccountCreateRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - registrar
 *      - referrer
 *      - referrer_percent
 *      - name
 *      - owner
 *      - active
 *      - options
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - account_create
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      registrar:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      referrer:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      referrer_percent:
 *        type: integer
 *        maximum: 10000
 *        example: 5000
 *      name:
 *        type: string
 *        example: jotprabh30
 *      owner:
 *        $ref: '#/definitions/AuthorityType'
 *      active:
 *        $ref: '#/definitions/AuthorityType'
 *      options:
 *        $ref: '#/definitions/AccountOptionsType'
 *  AccountUpdateRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - account
 *      - update_last_voting_time
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - account_update
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      account:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      owner:
 *        $ref: '#/definitions/AuthorityType'
 *      active:
 *        $ref: '#/definitions/AuthorityType'
 *      new_options:
 *        $ref: '#/definitions/AccountOptionsType'
 *      update_last_voting_time:
 *        type: boolean
 *  AccountWhitelistRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - authorizing_account
 *      - account_to_list
 *      - new_listing
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - account_whitelist
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      authorizing_account:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      account_to_list:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      new_listing:
 *        type: integer
 *        example: 1
 *  AccountUpgradeRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - account_to_upgrade
 *      - upgrade_to_lifetime_member
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - account_upgrade
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      account_to_upgrade:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      upgrade_to_lifetime_member:
 *        type: boolean
 *  AccountTransferRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - account_id
 *      - new_owner
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - account_transfer
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      account_id:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      new_owner:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *  PriceType:
 *    type: object
 *    required:
 *      - base
 *      - quote
 *    properties:
 *      base:
 *        $ref: '#/definitions/PeerplaysAssetType'
 *      quote:
 *        $ref: '#/definitions/PeerplaysAssetType'
 *  AssetOptionsType:
 *    type: object
 *    required:
 *      - max_supply
 *      - market_fee_percent
 *      - max_market_fee
 *      - issuer_permissions
 *      - flags
 *      - core_exchange_rate
 *      - whitelist_authorities
 *      - blacklist_authorities
 *      - whitelist_markets
 *      - blacklist_markets
 *      - description
 *    properties:
 *      max_supply:
 *        $ref: '#/definitions/PeerplaysAmountType'
 *      market_fee_percent:
 *        type: integer
 *        maximum: 10000
 *        example: 5000
 *      max_market_fee:
 *        type: integer
 *        maximum: 10000
 *        example: 5000
 *      issuer_permissions:
 *        type: integer
 *        example: 1
 *      flags:
 *        type: integer
 *        example: 1
 *      core_exchange_rate:
 *        $ref: '#/definitions/PriceType'
 *      whitelist_authorities:
 *        type: array
 *        items:
 *          $ref: '#/definitions/PeerplaysAccountIDType'
 *      blacklist_authorities:
 *        type: array
 *        items:
 *          $ref: '#/definitions/PeerplaysAccountIDType'
 *      whitelist_markets:
 *        type: array
 *        items:
 *          $ref: '#/definitions/PeerplaysAssetIDType'
 *      blacklist_markets:
 *        type: array
 *        items:
 *          $ref: '#/definitions/PeerplaysAssetIDType'
 *      description:
 *        type: string
 *        example: StreamersEdge Token Options
 *  BitassetOptionsType:
 *    type: object
 *    required:
 *      - feed_lifetime_sec
 *      - minimum_feeds
 *      - force_settlement_delay_sec
 *      - force_settlement_offset_percent
 *      - maximum_force_settlement_volume
 *      - short_backing_asset
 *    properties:
 *      feed_lifetime_sec:
 *        type: integer
 *        example: 10
 *      minimum_feeds:
 *        type: integer
 *        example: 2
 *      force_settlement_delay_sec:
 *        type: integer
 *        example: 10
 *      force_settlement_offset_percent:
 *        type: integer
 *        example: 1000
 *      maximum_force_settlement_volume:
 *        type: integer
 *        example: 1000
 *      short_backing_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *  LotteryAssetOptionsType:
 *    type: object
 *    required:
 *      - benefactors
 *      - owner
 *      - winning_tickets
 *      - ticket_price
 *      - end_date
 *      - ending_on_soldout
 *      - is_active
 *    properties:
 *      benefactors:
 *        type: array
 *        items:
 *          type: object
 *          required:
 *            - id
 *            - share
 *          properties:
 *            id:
 *              $ref: '#/definitions/PeerplaysAccountIDType'
 *            share:
 *              type: integer
 *              maximum: 10000
 *              example: 5000
 *      owner:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      winning_tickets:
 *        type: array
 *        items:
 *          type: integer
 *          maximum: 10000
 *          example: 5000
 *      ticket_price:
 *        $ref: '#/definitions/PeerplaysAssetType'
 *      end_date:
 *        type: integer
 *        example: 1608897600
 *      ending_on_soldout:
 *        type: boolean
 *      is_active:
 *        type: boolean
 *  AssetCreateRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - issuer
 *      - symbol
 *      - precision
 *      - common_options
 *      - is_prediction_market
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - asset_create
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      issuer:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      symbol:
 *        type: string
 *        maxLength: 10
 *        example: PPY
 *      precision:
 *        type: integer
 *        minimum: 0
 *        maximum: 10
 *        example: 8
 *      common_options:
 *        $ref: '#/definitions/AssetOptionsType'
 *      bitasset_opts:
 *        $ref: '#/definitions/BitassetOptionsType'
 *      is_prediction_market:
 *        type: boolean
 *  AssetUpdateRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - issuer
 *      - asset_to_update
 *      - new_options
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - asset_update
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      issuer:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      asset_to_update:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      new_issuer:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      new_options:
 *        $ref: '#/definitions/AssetOptionsType'
 *  AssetUpdateBitassetRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - issuer
 *      - asset_to_update
 *      - new_options
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - asset_update_bitasset
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      issuer:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      asset_to_update:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      new_options:
 *        $ref: '#/definitions/BitassetOptionsType'
 *  AssetUpdateFeedProducerRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - issuer
 *      - asset_to_update
 *      - new_feed_producers
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - asset_update_feed_producers
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      issuer:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      asset_to_update:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      new_feed_producers:
 *        type: array
 *        items:
 *          $ref: '#/definitions/PeerplaysAccountIDType'
 *        minItems: 1
 *  AssetIssueRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - issuer
 *      - asset_to_issue
 *      - issue_to_account
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - asset_issue
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      issuer:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      asset_to_issue:
 *        $ref: '#/definitions/PeerplaysAssetType'
 *      issue_to_account:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *  AssetReserveRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - payer
 *      - amount_to_reserve
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - asset_reserve
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      payer:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      amount_to_reserve:
 *        $ref: '#/definitions/PeerplaysAssetType'
 *  AssetFundFeePoolRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - from_account
 *      - asset_id
 *      - amount
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - asset_fund_fee_pool
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      from_account:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      asset_id:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      amount:
 *        $ref: '#/definitions/PeerplaysAmountType'
 *  AssetSettleRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - account
 *      - amount
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - asset_settle
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      account:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      amount:
 *        $ref: '#/definitions/PeerplaysAssetType'
 *  AssetGlobalSettleRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - issuer
 *      - asset_to_settle
 *      - settle_price
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - asset_global_settle
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      issuer:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      asset_to_settle:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      settle_price:
 *        $ref: '#/definitions/PriceType'
 *  AssetPublishFeedRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - publisher
 *      - asset_id
 *      - feed
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - asset_publish_feed
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      publisher:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      asset_id:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      feed:
 *        type: object
 *        required:
 *          - settle_price
 *          - maintenance_collateral_ratio
 *          - maximum_short_squeeze_ratio
 *          - core_exchange_rate
 *        properties:
 *          settle_price:
 *            $ref: '#/definitions/PriceType'
 *          maintenance_collateral_ratio:
 *            type: integer
 *            example: 500
 *          maximum_short_squeeze_ratio:
 *            type: integer
 *            example: 500
 *          core_exchange_rate:
 *            $ref: '#/definitions/PriceType'
 *  WitnessCreateRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - witness_account
 *      - url
 *      - block_signing_key
 *      - initial_secret
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - witness_create
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      witness_account:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      url:
 *        type: string
 *        format: uri
 *        example: https://www.blockchainmd.com/about
 *      block_signing_key:
 *        type: string
 *        example: PPYasd9u2j4nkas9un3k4r9usaeqrnlm
 *      initial_secret:
 *        type: string
 *        format: byte
 *        example: /9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAoHBwgHBgoIC...ljA5GC68sN8AoXT/AF7fw7//2Q==
 *  WitnessUpdateRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - witness
 *      - witness_account
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - witness_update
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      witness:
 *        type: string
 *        pattern: '^(1.6.)\d+$'
 *        example: 1.6.11
 *      witness_account:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      new_url:
 *        type: string
 *        format: uri
 *        example: https://www.blockchainmd.com/about
 *      new_signing_key:
 *        type: string
 *        example: PPYasd9u2j4nkas9un3k4r9usaeqrnlm
 *      new_initial_secret:
 *        type: string
 *        format: byte
 *        example: /9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAoHBwgHBgoIC...ljA5GC68sN8AoXT/AF7fw7//2Q==
 *  ProposalCreateRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - fee_paying_account
 *      - expiration_time
 *      - proposed_ops
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - proposal_create
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      fee_paying_account:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      expiration_time:
 *        type: integer
 *        example: 1608897600
 *      proposed_ops:
 *        type: array
 *        items: {}
 *        minItems: 1
 *      review_period_seconds:
 *        type: integer
 *        example: 2000
 *  ProposalUpdateRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - fee_paying_account
 *      - proposal
 *      - active_approvals_to_add
 *      - active_approvals_to_remove
 *      - owner_approvals_to_add
 *      - owner_approvals_to_remove
 *      - key_approvals_to_add
 *      - key_approvals_to_remove
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - proposal_update
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      fee_paying_account:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      proposal:
 *        type: string
 *        pattern: '^(1.10.)\d+$'
 *        example: 1.10.11
 *      active_approvals_to_add:
 *        type: array
 *        items:
 *          $ref: '#/definitions/PeerplaysAccountIDType'
 *      active_approvals_to_remove:
 *        type: array
 *        items:
 *          $ref: '#/definitions/PeerplaysAccountIDType'
 *      owner_approvals_to_add:
 *        type: array
 *        items:
 *          $ref: '#/definitions/PeerplaysAccountIDType'
 *      owner_approvals_to_remove:
 *        type: array
 *        items:
 *          $ref: '#/definitions/PeerplaysAccountIDType'
 *      key_approvals_to_add:
 *        type: array
 *        items:
 *          type: string
 *          example: PPYJ134s039ks93k9mdoowmi3mk
 *      key_approvals_to_remove:
 *        type: array
 *        items:
 *          type: string
 *          example: PPYJ134s039ks93k9mdoowmi3mk
 *  ProposalDeleteRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - fee_paying_account
 *      - using_owner_authority
 *      - proposal
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - proposal_delete
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      fee_paying_account:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      using_owner_authority:
 *        type: boolean
 *      proposal:
 *        type: string
 *        pattern: '^(1.10.)\d+$'
 *        example: 1.10.11
 *  WithdrawPermissionCreateRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - withdraw_from_account
 *      - authorized_account
 *      - withdrawal_limit
 *      - withdrawal_period_sec
 *      - periods_until_expiration
 *      - period_start_time
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - withdraw_permission_create
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      withdraw_from_account:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      authorized_account:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      withdrawal_limit:
 *        $ref: '#/definitions/PeerplaysAssetType'
 *      withdrawal_period_sec:
 *        type: integer
 *        example: 100
 *      periods_until_expiration:
 *        type: integer
 *        example: 10
 *      period_start_time:
 *        type: integer
 *        example: 1608897600
 *  WithdrawPermissionUpdateRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - withdraw_from_account
 *      - authorized_account
 *      - permission_to_update
 *      - withdrawal_limit
 *      - withdrawal_period_sec
 *      - periods_until_expiration
 *      - period_start_time
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - withdraw_permission_update
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      withdraw_from_account:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      authorized_account:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      permission_to_update:
 *        type: string
 *        pattern: '^(1.12.)\d+$'
 *        example: 1.12.1
 *      withdrawal_limit:
 *        $ref: '#/definitions/PeerplaysAssetType'
 *      withdrawal_period_sec:
 *        type: integer
 *        example: 100
 *      periods_until_expiration:
 *        type: integer
 *        example: 10
 *      period_start_time:
 *        type: integer
 *        example: 1608897600
 *  WithdrawPermissionClaimRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - withdraw_permission
 *      - withdraw_from_account
 *      - withdraw_to_account
 *      - amount_to_withdraw
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - withdraw_permission_claim
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      withdraw_permission:
 *        type: string
 *        pattern: '^(1.12.)\d+$'
 *        example: 1.12.1
 *      withdraw_from_account:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      withdraw_to_account:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      amount_to_withdraw:
 *        $ref: '#/definitions/PeerplaysAssetType'
 *  WithdrawPermissionDeleteRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - withdraw_permission
 *      - withdraw_from_account
 *      - authorized_account
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - withdraw_permission_delete
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      withdraw_permission:
 *        type: string
 *        pattern: '^(1.12.)\d+$'
 *        example: 1.12.1
 *      withdraw_from_account:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      authorized_account:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *  CommitteeMemberCreateRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - committee_member_account
 *      - url
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - committee_member_create
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      committee_member_account:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      url:
 *        type: string
 *        pattern: uri
 *        example: 'https://committeemember-abc.com/'
 *  CommitteeMemberUpdateRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - committee_member
 *      - committee_member_account
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - committee_member_update
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      committee_member:
 *        type: string
 *        pattern: '^(1.5.)\d+$'
 *        example: 1.5.1
 *      committee_member_account:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      new_url:
 *        type: string
 *        pattern: uri
 *        example: 'https://committeemember-abc.com/'
 *  CommitteeMemberUpdateGlobalParametersRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - new_parameters
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - committee_member_update_global_parameters
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      new_parameters:
 *        type: object
 *  VestingBalanceCreateRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - creator
 *      - owner
 *      - amount
 *      - policy
 *      - balance_type
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - vesting_balance_create
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      creator:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      owner:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      amount:
 *        $ref: '#/definitions/PeerplaysAssetType'
 *      policy:
 *        type: array
 *        minItems: 2
 *        maxItems: 2
 *        items: {}
 *        example:
 *          - 1
 *          - { start_claim: 160882928, vesting_seconds: 1000 }
 *      balance_type:
 *        type: string
 *        enum:
 *          - normal
 *          - gpos
 *          - son
 *  VestingBalanceWithdrawRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - vesting_balance
 *      - owner
 *      - amount
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - vesting_balance_withdraw
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      vesting_balance:
 *        type: string
 *        pattern: '^(1.13.)\d+$'
 *        example: 1.13.1
 *      owner:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      amount:
 *        $ref: '#/definitions/PeerplaysAssetType'
 *  WorkerCreateRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - owner
 *      - work_begin_date
 *      - work_end_date
 *      - daily_pay
 *      - name
 *      - url
 *      - initializer
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - worker_create
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      owner:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      work_begin_date:
 *        type: integer
 *        example: 1608897600
 *      work_end_date:
 *        type: integer
 *        example: 1608897600
 *      daily_pay:
 *        $ref: '#/definitions/PeerplaysAmountType'
 *      name:
 *        type: string
 *        example: Aslam
 *      url:
 *        type: string
 *        format: uri
 *        example: https://abc.com
 *      initializer:
 *        type: array
 *        minItems: 2
 *        maxItems: 2
 *        items: {}
 *        example:
 *          - 1
 *          - { pay_vesting_period_days: 7 }
 *  CustomRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - payer
 *      - required_auths
 *      - id
 *      - data
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - custom
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      payer:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      required_auths:
 *        type: array
 *        items:
 *          $ref: '#/definitions/PeerplaysAccountIDType'
 *        minItems: 1
 *      id:
 *        type: integer
 *        example: 1608897600
 *      data:
 *        type: string
 *        format: byte
 *        example: /9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAoHBwgHBgoIC...ljA5GC68sN8AoXT/AF7fw7//2Q==
 *  AssertRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - fee_paying_account
 *      - predicates
 *      - required_auths
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - assert
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      fee_paying_account:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      predicates:
 *        type: array
 *        items:
 *          type: array
 *          minItems: 2
 *          maxItems: 2
 *          items: {}
 *          example:
 *            - 1
 *            - { asset_id: 1.3.0, symbol: ppy }
 *      required_auths:
 *        type: array
 *        items:
 *          $ref: '#/definitions/PeerplaysAccountIDType'
 *        minItems: 1
 *  BalanceClaimRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - deposit_to_account
 *      - balance_to_claim
 *      - balance_owner_key
 *      - total_claimed
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - balance_claim
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      deposit_to_account:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      balance_to_claim:
 *        type: string
 *        pattern: '^(1.13.)\d+$'
 *        example: 1.13.1
 *      balance_owner_key:
 *        type: string
 *        example: PPYb5bbjhjb7b7tgb865fvhhu7g
 *      total_claimed:
 *        $ref: '#/definitions/PeerplaysAssetType'
 *  OverrideTransferRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - issuer
 *      - from
 *      - to
 *      - amount
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - override_transfer
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      issuer:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      from:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      to:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      amount:
 *        $ref: '#/definitions/PeerplaysAssetType'
 *  StealthConfirmationType:
 *    type: object
 *    required:
 *      - one_time_key
 *      - encrypted_memo
 *    properties:
 *      one_time_key:
 *        type: string
 *        example: PPYb5bbjhjb7b7tgb865fvhhu7g
 *      to:
 *        type: string
 *        example: PPYb5bbjhjb7b7tgb865fvhhu7g
 *      encrypted_memo:
 *        type: string
 *        format: byte
 *        example: /9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAoHBwgHBgoIC...ljA5GC68sN8AoXT/AF7fw7//2Q==
 *  BlindOutputType:
 *    type: object
 *    required:
 *      - commitment
 *      - range_proof
 *      - owner
 *    properties:
 *      commitment:
 *        type: string
 *        format: byte
 *        example: /9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAoHBwgHBgoIC...ljA5GC68sN8AoXT/AF7fw7//2Q==
 *      range_proof:
 *        type: string
 *        format: byte
 *        example: /9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAoHBwgHBgoIC...ljA5GC68sN8AoXT/AF7fw7//2Q==
 *      owner:
 *        $ref: '#/definitions/AuthorityType'
 *      stealth_memo:
 *        $ref: '#/definitions/StealthConfirmationType'
 *  TransferToBlindRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - amount
 *      - from
 *      - blinding_factor
 *      - outputs
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - transfer_to_blind
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      amount:
 *        $ref: '#/definitions/PeerplaysAssetType'
 *      from:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      blinding_factor:
 *        type: string
 *        format: byte
 *        example: /9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAoHBwgHBgoIC...ljA5GC68sN8AoXT/AF7fw7//2Q==
 *      outputs:
 *        type: array
 *        items:
 *          $ref: '#/definitions/BlindOutputType'
 *  BlindInputType:
 *    type: object
 *    required:
 *      - commitment
 *      - owner
 *    properties:
 *      commitment:
 *        type: string
 *        format: byte
 *        example: /9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAoHBwgHBgoIC...ljA5GC68sN8AoXT/AF7fw7//2Q==
 *      owner:
 *        $ref: '#/definitions/AuthorityType'
 *  BlindTransferRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - inputs
 *      - outputs
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - blind_transfer
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      inputs:
 *        type: array
 *        items:
 *          $ref: '#/definitions/BlindInputType'
 *      outputs:
 *        type: array
 *        items:
 *          $ref: '#/definitions/BlindOutputType'
 *  TransferFromBlindRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - amount
 *      - to
 *      - blinding_factor
 *      - inputs
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - transfer_from_blind
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      amount:
 *        $ref: '#/definitions/PeerplaysAssetType'
 *      to:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      blinding_factor:
 *        type: string
 *        format: byte
 *        example: /9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAoHBwgHBgoIC...ljA5GC68sN8AoXT/AF7fw7//2Q==
 *      inputs:
 *        type: array
 *        items:
 *          $ref: '#/definitions/BlindInputType'
 *  AssetSettleCancelRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - settlement
 *      - account
 *      - amount
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - asset_settle_cancel
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      settlement:
 *        type: string
 *        pattern: '^(1.4.)\d+$'
 *        example: 1.4.1
 *      account:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      amount:
 *        $ref: '#/definitions/PeerplaysAssetType'
 *  AssetClaimFeesRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - issuer
 *      - amount_to_claim
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - asset_claim_fees
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      issuer:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      amount_to_claim:
 *        $ref: '#/definitions/PeerplaysAssetType'
 *  FBADistributeRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - account_id
 *      - fba_id
 *      - amount
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - fba_distribute
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      account_id:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      fba_id:
 *        type: string
 *        pattern: '^(2.16.)\d+$'
 *        example: 2.16.1
 *      amount:
 *        $ref: '#/definitions/PeerplaysAmountType'
 *  RockPaperScissorsGameOptionsType:
 *    type: object
 *    required:
 *      - insurance_enabled
 *      - time_per_commit_move
 *      - time_per_reveal_move
 *      - number_of_gestures
 *    properties:
 *      insurance_enabled:
 *        type: boolean
 *      time_per_commit_move:
 *        type: integer
 *        example: 100
 *      time_per_reveal_move:
 *        type: integer
 *        example: 100
 *      number_of_gestures:
 *        type: integer
 *        example: 10
 *  TournamentOptionsType:
 *    type: object
 *    required:
 *      - type_of_game
 *      - registration_deadline
 *      - number_of_players
 *      - buy_in
 *      - whitelist
 *      - start_time
 *      - start_delay
 *      - round_delay
 *      - number_of_wins
 *      - meta
 *      - game_options
 *    properties:
 *      type_of_game:
 *        type: integer
 *        example: 1
 *      registration_deadline:
 *        type: integer
 *        example: 1609893839
 *      number_of_players:
 *        type: integer
 *        example: 4
 *      buy_in:
 *        $ref: '#/definitions/PeerplaysAssetType'
 *      whitelist:
 *        type: array
 *        items:
 *          $ref: '#/definitions/PeerplaysAccountIDType'
 *      start_time:
 *        type: integer
 *        example: 1609893839
 *      start_delay:
 *        type: integer
 *        example: 10
 *      round_delay:
 *        type: integer
 *        example: 1
 *      number_of_wins:
 *        type: integer
 *        example: 3
 *      meta:
 *        type: object
 *        example: {}
 *      game_options:
 *        type: array
 *        minItems: 2
 *        maxItems: 2
 *        items: {}
 *        example:
 *          - 1
 *          - { insurance_enabled: true, time_per_commit_move: 100, time_per_reveal_move: 100, number_of_gestures: 3 }
 *  TournamentCreateRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - creator
 *      - options
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - tournament_create
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      creator:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      options:
 *        $ref: '#/definitions/TournamentOptionsType'
 *  TournamentJoinRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - payer_account_id
 *      - player_account_id
 *      - tournament_id
 *      - buy_in
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - tournament_join
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      payer_account_id:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      player_account_id:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      tournament_id:
 *        type: string
 *        pattern: '^(1.16.)\d+$'
 *        example: 1.16.11
 *      buy_in:
 *        $ref: '#/definitions/PeerplaysAssetType'
 *  GameMoveRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - player_account_id
 *      - game_id
 *      - move
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - game_move
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      player_account_id:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      game_id:
 *        type: string
 *        pattern: '^(1.19.)\d+$'
 *        example: 1.19.11
 *      move:
 *        type: array
 *        minItems: 2
 *        maxItems: 2
 *        items: {}
 *        example:
 *          - 0
 *          - { nonce1: 11, throw_hash: kajsd8nk9aj39jsd9fmq393rjopa/as9ji3n }
 *  AssetUpdateDividendRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - issuer
 *      - asset_to_update
 *      - new_options
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - asset_update_dividend
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      issuer:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      asset_to_update:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      new_options:
 *        type: object
 *        required:
 *          - minimum_fee_percentage
 *        properties:
 *          next_payout_time:
 *            type: integer
 *            example: 1609289792
 *          payout_interval:
 *            type: integer
 *            example: 60000
 *          minimum_fee_percentage:
 *            type: integer
 *            example: 100
 *          minimum_distribution_interval:
 *            type: integer
 *            example: 60000
 *  AssetDividendDistributionRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - account_id
 *      - dividend_asset_id
 *      - amounts
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - asset_dividend_distribution
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      dividend_asset_id:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      account_id:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      amounts:
 *        type: array
 *        items:
 *          $ref: '#/definitions/PeerplaysAssetType'
 *        minItems: 1
 *  SportCreateRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - name
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - sport_create
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      name:
 *        type: array
 *        items:
 *          type: array
 *          minItems: 2
 *          maxItems: 2
 *          items:
 *            type: string
 *            example: soccer
 *  SportUpdateRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - sport_id
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - sport_update
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      sport_id:
 *        type: string
 *        pattern: '^(1.20.)\d+$'
 *        example: 1.20.1
 *      new_name:
 *        type: array
 *        items:
 *          type: array
 *          minItems: 2
 *          maxItems: 2
 *          items:
 *            type: string
 *            example: soccer
 *  EventGroupCreateRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - name
 *      - sport_id
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - event_group_create
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      name:
 *        type: array
 *        items:
 *          type: array
 *          minItems: 2
 *          maxItems: 2
 *          items:
 *            type: string
 *            example: Champions Trophy
 *      sport_id:
 *        type: string
 *        pattern: '^(1.20.)\d+$'
 *        example: 1.20.1
 *  EventGroupUpdateRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - event_group_id
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - event_group_update
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      new_name:
 *        type: array
 *        items:
 *          type: array
 *          minItems: 2
 *          maxItems: 2
 *          items:
 *            type: string
 *            example: Champions Trophy
 *      new_sport_id:
 *        type: string
 *        pattern: '^(1.20.)\d+$'
 *        example: 1.20.1
 *      event_group_id:
 *        type: string
 *        pattern: '^(1.21.)\d+$'
 *        example: 1.21.1
 *  EventCreateRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - name
 *      - season
 *      - event_group_id
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - event_create
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      name:
 *        type: array
 *        items:
 *          type: array
 *          minItems: 2
 *          maxItems: 2
 *          items:
 *            type: string
 *            example: Manchester United vs Arsenal
 *      season:
 *        type: array
 *        items:
 *          type: array
 *          minItems: 2
 *          maxItems: 2
 *          items:
 *            type: string
 *            example: 2020
 *      start_time:
 *        type: integer
 *        example: 160982982
 *      event_group_id:
 *        type: string
 *        pattern: '^(1.21.)\d+$'
 *        example: 1.21.1
 *  EventUpdateRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - event_id
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - event_update
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      event_id:
 *        type: string
 *        pattern: '^(1.22.)\d+$'
 *        example: 1.22.1
 *      new_name:
 *        type: array
 *        items:
 *          type: array
 *          minItems: 2
 *          maxItems: 2
 *          items:
 *            type: string
 *            example: Manchester United vs Arsenal
 *      new_season:
 *        type: array
 *        items:
 *          type: array
 *          minItems: 2
 *          maxItems: 2
 *          items:
 *            type: string
 *            example: 2020
 *      new_start_time:
 *        type: integer
 *        example: 160982982
 *      new_event_group_id:
 *        type: string
 *        pattern: '^(1.21.)\d+$'
 *        example: 1.21.1
 *      is_live_market:
 *        type: boolean
 *  BettingMarketRulesCreateRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - name
 *      - description
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - betting_market_rules_create
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      name:
 *        type: array
 *        items:
 *          type: array
 *          minItems: 2
 *          maxItems: 2
 *          items:
 *            type: string
 *            example: Rule 1
 *      description:
 *        type: array
 *        items:
 *          type: array
 *          minItems: 2
 *          maxItems: 2
 *          items:
 *            type: string
 *            example: Player can not bet on the same event twice
 *  BettingMarketRulesUpdateRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - betting_market_rules_id
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - betting_market_rules_update
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      new_name:
 *        type: array
 *        items:
 *          type: array
 *          minItems: 2
 *          maxItems: 2
 *          items:
 *            type: string
 *            example: Rule 1
 *      new_description:
 *        type: array
 *        items:
 *          type: array
 *          minItems: 2
 *          maxItems: 2
 *          items:
 *            type: string
 *            example: Player can not bet on the same event twice
 *      betting_market_rules_id:
 *        type: string
 *        pattern: '^(1.23.)\d+$'
 *        example: 1.23.1
 *  BettingMarketGroupCreateRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - description
 *      - event_id
 *      - rules_id
 *      - asset_id
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - betting_market_group_create
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      description:
 *        type: array
 *        items:
 *          type: array
 *          minItems: 2
 *          maxItems: 2
 *          items:
 *            type: string
 *            example: Bookie Group
 *      event_id:
 *        type: string
 *        pattern: '^(1.22.)\d+$'
 *        example: 1.22.1
 *      rules_id:
 *        type: string
 *        pattern: '^(1.23.)\d+$'
 *        example: 1.23.1
 *      asset_id:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *  BettingMarketCreateRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - group_id
 *      - description
 *      - payout_condition
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - betting_market_create
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      group_id:
 *        type: string
 *        pattern: '^(1.24.)\d+$'
 *        example: 1.24.1
 *      description:
 *        type: array
 *        items:
 *          type: array
 *          minItems: 2
 *          maxItems: 2
 *          items:
 *            type: string
 *            example: Bookie Market
 *      payout_condition:
 *        type: array
 *        items:
 *          type: array
 *          minItems: 2
 *          maxItems: 2
 *          items:
 *            type: string
 *            example: After match has ended
 *  BetPlaceRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - bettor_id
 *      - betting_market_id
 *      - amount_to_bet
 *      - backer_multiplier
 *      - back_or_lay
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - bet_place
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      bettor_id:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      betting_market_id:
 *        type: string
 *        pattern: '^(1.25.)\d+$'
 *        example: 1.25.1
 *      amount_to_bet:
 *        $ref: '#/definitions/PeerplaysAssetType'
 *      backer_multiplier:
 *        type: integer
 *        example: 10
 *      back_or_lay:
 *        type: string
 *        enum:
 *          - back
 *          - lay
 *  BettingMarketGroupResolveRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - betting_market_group_id
 *      - resolutions
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - betting_market_group_resolve
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      betting_market_group_id:
 *        type: string
 *        pattern: '^(1.24.)\d+$'
 *        example: 1.24.1
 *      resolutions:
 *        type: array
 *        items:
 *          type: array
 *          minItems: 2
 *          maxItems: 2
 *          items: {}
 *          example:
 *            - 1.25.1
 *            - not_win
 *  BettingMarketGroupResolvedRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - bettor_id
 *      - betting_market_group_id
 *      - resolutions
 *      - winnings
 *      - fees_paid
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - betting_market_group_resolved
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      bettor_id:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      betting_market_group_id:
 *        type: string
 *        pattern: '^(1.24.)\d+$'
 *        example: 1.24.1
 *      resolutions:
 *        type: array
 *        items:
 *          type: array
 *          minItems: 2
 *          maxItems: 2
 *          items: {}
 *          example:
 *            - 1.25.1
 *            - not_win
 *      winnings:
 *        $ref: '#/definitions/PeerplaysAmountType'
 *      fees_paid:
 *        $ref: '#/definitions/PeerplaysAmountType'
 *  BettingMarketGroupCancelUnmatchedBetsRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - betting_market_group_id
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - betting_market_group_cancel_unmatched_bets
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      betting_market_group_id:
 *        type: string
 *        pattern: '^(1.24.)\d+$'
 *        example: 1.24.1
 *  BetMatchedRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - bettor_id
 *      - bet_id
 *      - betting_market_id
 *      - amount_bet
 *      - fees_paid
 *      - backer_multiplier
 *      - guaranteed_winnings_returned
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - bet_matched
 *      bettor_id:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      bet_id:
 *        type: string
 *        pattern: '^(1.26.)\d+$'
 *        example: 1.26.1
 *      betting_market_id:
 *        type: string
 *        pattern: '^(1.25.)\d+$'
 *        example: 1.25.1
 *      amount_bet:
 *        $ref: '#/definitions/PeerplaysAssetType'
 *      fees_paid:
 *        $ref: '#/definitions/PeerplaysAmountType'
 *      backer_multiplier:
 *        type: integer
 *        example: 10
 *      guaranteed_winnings_returned:
 *        $ref: '#/definitions/PeerplaysAmountType'
 *  BetCancelRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - bettor_id
 *      - bet_to_cancel
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - bet_cancel
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      bettor_id:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      bet_to_cancel:
 *        type: string
 *        pattern: '^(1.26.)\d+$'
 *        example: 1.26.1
 *  BetCanceledRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - bettor_id
 *      - bet_id
 *      - stake_returned
 *      - unused_fees_returned
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - bet_canceled
 *      bettor_id:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      bet_id:
 *        type: string
 *        pattern: '^(1.26.)\d+$'
 *        example: 1.26.1
 *      stake_returned:
 *        $ref: '#/definitions/PeerplaysAssetType'
 *      unused_fees_returned:
 *        $ref: '#/definitions/PeerplaysAssetType'
 *  TournamentPayoutRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - payout_account_id
 *      - tournament_id
 *      - payout_amount
 *      - type
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - tournament_payout
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      payout_account_id:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      tournament_id:
 *        type: string
 *        pattern: '^(1.16.)\d+$'
 *        example: 1.16.1
 *      payout_amount:
 *        $ref: '#/definitions/PeerplaysAssetType'
 *      type:
 *        type: string
 *        enum:
 *          - prize_award
 *          - buyin_refund
 *          - rake_fee
 *  TournamentLeaveRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - canceling_account_id
 *      - player_account_id
 *      - tournament_id
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - tournament_leave
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      canceling_account_id:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      player_account_id:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      tournament_id:
 *        type: string
 *        pattern: '^(1.16.)\d+$'
 *        example: 1.16.1
 *  BettingMarketGroupUpdateRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - betting_market_group_id
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - betting_market_group_update
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      betting_market_group_id:
 *        type: string
 *        pattern: '^(1.24.)\d+$'
 *        example: 1.24.1
 *      new_description:
 *        type: array
 *        items:
 *          type: array
 *          minItems: 2
 *          maxItems: 2
 *          items:
 *            type: string
 *            example: Bookie Group
 *      new_rules_id:
 *        type: string
 *        pattern: '^(1.23.)\d+$'
 *        example: 1.23.1
 *      freeze:
 *        type: boolean
 *      delay_bets:
 *        type: boolean
 *  BettingMarketUpdateRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - betting_market_id
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - betting_market_update
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      betting_market_id:
 *        type: string
 *        pattern: '^(1.25.)\d+$'
 *        example: 1.25.1
 *      new_group_id:
 *        type: string
 *        pattern: '^(1.24.)\d+$'
 *        example: 1.24.1
 *      new_description:
 *        type: array
 *        items:
 *          type: array
 *          minItems: 2
 *          maxItems: 2
 *          items:
 *            type: string
 *            example: Bookie Market
 *      new_payout_condition:
 *        type: array
 *        items:
 *          type: array
 *          minItems: 2
 *          maxItems: 2
 *          items:
 *            type: string
 *            example: After match has ended
 *  BetAdjustedRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - bettor_id
 *      - bet_id
 *      - stake_returned
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - bet_adjusted
 *      bettor_id:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      bet_id:
 *        type: string
 *        pattern: '^(1.26.)\d+$'
 *        example: 1.26.1
 *      stake_returned:
 *        $ref: '#/definitions/PeerplaysAssetType'
 *  LotteryAssetCreateRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - issuer
 *      - symbol
 *      - precision
 *      - common_options
 *      - is_prediction_market
 *      - extensions
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - lottery_asset_create
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      issuer:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      symbol:
 *        type: string
 *        maxLength: 10
 *        example: PPY
 *      precision:
 *        type: integer
 *        minimum: 0
 *        maximum: 10
 *        example: 8
 *      common_options:
 *        $ref: '#/definitions/AssetOptionsType'
 *      bitasset_opts:
 *        $ref: '#/definitions/BitassetOptionsType'
 *      is_prediction_market:
 *        type: boolean
 *      extensions:
 *        $ref: '#/definitions/LotteryAssetOptionsType'
 *  TicketPurchaseRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - lottery
 *      - buyer
 *      - tickets_to_buy
 *      - amount
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - ticket_purchase
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      lottery:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      buyer:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      tickets_to_buy:
 *        $ref: '#/definitions/PeerplaysAmountType'
 *      amount:
 *        $ref: '#/definitions/PeerplaysAssetType'
 *  LotteryRewardRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - lottery
 *      - winner
 *      - amount
 *      - win_percentage
 *      - is_benefactor_reward
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - lottery_reward
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      lottery:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      winner:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      amount:
 *        $ref: '#/definitions/PeerplaysAssetType'
 *      win_percentage:
 *        type: integer
 *        maximum: 10000
 *        example: 5000
 *      is_benefactor_reward:
 *        type: boolean
 *  LotteryEndRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - lottery
 *      - participants
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - lottery_end
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      lottery:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      participants:
 *        type: array
 *        items:
 *          type: array
 *          minItems: 2
 *          maxItems: 2
 *          items: {}
 *          example:
 *            - 1.2.31
 *            - 0
 *  SweepsVestingClaimRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - account
 *      - amount_to_claim
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - sweeps_vesting_claim
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      account:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      amount_to_claim:
 *        $ref: '#/definitions/PeerplaysAssetType'
 *  CustomPermissionCreateRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - owner_account
 *      - permission_name
 *      - auth
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - custom_permission_create
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      owner_account:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      permission_name:
 *        type: string
 *        maxLength: 10
 *        example: abc123
 *      auth:
 *        $ref: '#/definitions/AuthorityType'
 *  CustomPermissionUpdateRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - permission_id
 *      - new_auth
 *      - owner_account
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - custom_permission_update
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      permission_id:
 *        type: string
 *        pattern: '^(1.27.)\d+$'
 *        example: 1.27.2
 *      new_auth:
 *        $ref: '#/definitions/AuthorityType'
 *      owner_account:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *  CustomPermissionDeleteRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - permission_id
 *      - owner_account
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - custom_permission_delete
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      permission_id:
 *        type: string
 *        pattern: '^(1.27.)\d+$'
 *        example: 1.27.2
 *      owner_account:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *  CustomAccountAuthorityCreateRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - permission_id
 *      - operation_type
 *      - valid_from
 *      - valid_to
 *      - owner_account
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - custom_account_authority_create
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      permission_id:
 *        type: string
 *        pattern: '^(1.27.)\d+$'
 *        example: 1.27.2
 *      operation_type:
 *        type: integer
 *        minimum: 0
 *        example: 0
 *      valid_from:
 *        type: integer
 *        example: 160986767
 *      valid_to:
 *        type: integer
 *        example: 160989767
 *      owner_account:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *  CustomAccountAuthorityUpdateRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - auth_id
 *      - owner_account
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - custom_account_authority_update
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      auth_id:
 *        type: string
 *        pattern: '^(1.28.)\d+$'
 *        example: 1.28.2
 *      new_valid_from:
 *        type: integer
 *        example: 160986767
 *      new_valid_to:
 *        type: integer
 *        example: 160989767
 *      owner_account:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *  CustomAccountAuthorityDeleteRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - auth_id
 *      - owner_account
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - custom_account_authority_delete
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      auth_id:
 *        type: string
 *        pattern: '^(1.28.)\d+$'
 *        example: 1.28.2
 *      owner_account:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *  FinalizeOfferRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - fee_paying_account
 *      - offer_id
 *      - result
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - finalize_offer
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      fee_paying_account:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      offer_id:
 *        type: string
 *        pattern: '^(1.29.)\d+$'
 *        example: 1.29.0
 *      result:
 *        type: string
 *        enum:
 *          - Expired
 *          - ExpiredNoBid
 *          - Cancelled
 *  AccountRoleCreateRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - owner
 *      - name
 *      - metadata
 *      - allowed_operations
 *      - whitelisted_accounts
 *      - valid_from
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - account_role_create
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      owner:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      name:
 *        type: string
 *        example: admin
 *      metadata:
 *        type: string
 *        example: permitted for all ops
 *      allowed_operations:
 *        type: array
 *        items:
 *          type: integer
 *          minimum: 0
 *          example: 80
 *      whitelisted_accounts:
 *        type: array
 *        items:
 *          $ref: '#/definitions/PeerplaysAccountIDType'
 *      valid_from:
 *        type: integer
 *        example: 1609876722
 *  AccountRoleUpdateRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - owner
 *      - account_role_id
 *      - allowed_operations_to_add
 *      - allowed_operations_to_remove
 *      - accounts_to_add
 *      - accounts_to_remove
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - account_role_update
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      owner:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      account_role_id:
 *        type: string
 *        pattern: '^(1.32.)\d+$'
 *        example: 1.32.0
 *      name:
 *        type: string
 *        example: admin
 *      metadata:
 *        type: string
 *        example: permitted for all ops
 *      allowed_operations_to_add:
 *        type: array
 *        items:
 *          type: integer
 *          minimum: 0
 *          example: 80
 *      allowed_operations_to_remove:
 *        type: array
 *        items:
 *          type: integer
 *          minimum: 0
 *          example: 80
 *      accounts_to_add:
 *        type: array
 *        items:
 *          $ref: '#/definitions/PeerplaysAccountIDType'
 *      accounts_to_remove:
 *        type: array
 *        items:
 *          $ref: '#/definitions/PeerplaysAccountIDType'
 *      valid_to:
 *        type: integer
 *        example: 1609876722
 *  AccountRoleDeleteRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - owner
 *      - account_role_id
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - account_role_delete
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      owner:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      account_role_id:
 *        type: string
 *        pattern: '^(1.32.)\d+$'
 *        example: 1.32.0
 *  SidechainType:
 *    type: string
 *    enum:
 *      - unknown
 *      - bitcoin
 *      - ethereum
 *      - eos
 *      - peerplays
 *  SONCreateRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - owner_account
 *      - url
 *      - deposit
 *      - signing_key
 *      - sidechain_public_keys
 *      - pay_vb
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - son_create
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      owner_account:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      url:
 *        type: string
 *        format: uri
 *        example: https://www.dummyurl.com/son
 *      deposit:
 *        type: string
 *        pattern: '^(1.13.)\d+$'
 *        example: 1.13.102
 *      signing_key:
 *        type: string
 *        example: PPYk29k2ms9ksm9sms0os9l3/9k3ojdh3ud
 *      sidechain_public_keys:
 *        type: array
 *        items:
 *          type: array
 *          minItems: 2
 *          maxItems: 2
 *          items: {}
 *          example:
 *            - bitcoin
 *            - BTCj2l2m2ok4ms9uhn3irthsbdnfoihiesbf3d
 *      pay_vb:
 *        type: string
 *        pattern: '^(1.13.)\d+$'
 *        example: 1.13.103
 *  SONUpdateRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - son_id
 *      - owner_account
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - son_update
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      son_id:
 *        type: string
 *        pattern: '^(1.33.)\d+$'
 *        example: 1.33.0
 *      owner_account:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      new_url:
 *        type: string
 *        format: uri
 *        example: https://www.dummyurl.com/son
 *      new_deposit:
 *        type: string
 *        pattern: '^(1.13.)\d+$'
 *        example: 1.13.102
 *      new_signing_key:
 *        type: string
 *        example: PPYk29k2ms9ksm9sms0os9l3/9k3ojdh3ud
 *      new_sidechain_public_keys:
 *        type: array
 *        items:
 *          type: array
 *          minItems: 2
 *          maxItems: 2
 *          items: {}
 *          example:
 *            - bitcoin
 *            - BTCj2l2m2ok4ms9uhn3irthsbdnfoihiesbf3d
 *      new_pay_vb:
 *        type: string
 *        pattern: '^(1.13.)\d+$'
 *        example: 1.13.103
 *  SONDeregisterRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - son_id
 *      - payer
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - son_deregister
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      son_id:
 *        type: string
 *        pattern: '^(1.33.)\d+$'
 *        example: 1.33.0
 *      payer:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *  SONHeartbeatRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - son_id
 *      - owner_account
 *      - ts
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - son_heartbeat
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      son_id:
 *        type: string
 *        pattern: '^(1.33.)\d+$'
 *        example: 1.33.0
 *      owner_account:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      ts:
 *        type: integer
 *        example: 1609878978
 *  SONReportDownRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - son_id
 *      - payer
 *      - down_ts
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - son_report_down
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      son_id:
 *        type: string
 *        pattern: '^(1.33.)\d+$'
 *        example: 1.33.0
 *      payer:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      down_ts:
 *        type: integer
 *        example: 1609878978
 *  SONMaintenanceRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - son_id
 *      - owner_account
 *      - request_type
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - son_maintenance
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      son_id:
 *        type: string
 *        pattern: '^(1.33.)\d+$'
 *        example: 1.33.0
 *      owner_account:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      request_type:
 *        type: string
 *        enum:
 *          - request_maintenance
 *          - cancel_request_maintenance
 *  SONInfoType:
 *    type: object
 *    required:
 *      - son_id
 *      - weight
 *      - signing_key
 *      - sidechain_public_keys
 *    properties:
 *      son_id:
 *        type: string
 *        pattern: '^(1.33.)\d+$'
 *        example: 1.33.0
 *      weight:
 *        type: integer
 *        minimum: 0
 *        example: 100
 *      signing_key:
 *        type: string
 *        example: PPYaisjd9j28ah7h32unsa8h82i3jr8awf8h37u
 *      sidechain_public_keys:
 *        type: array
 *        items:
 *          type: array
 *          minItems: 2
 *          maxItems: 2
 *          items: {}
 *          example:
 *            - bitcoin
 *            - BTCj2l2m2ok4ms9uhn3irthsbdnfoihiesbf3d
 *  SONWalletRecreateRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - payer
 *      - sons
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - son_wallet_recreate
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      payer:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      sons:
 *        type: array
 *        minItems: 1
 *        items:
 *          $ref: '#/definitions/SONInfoType'
 *  SONWalletUpdateRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - payer
 *      - son_wallet_id
 *      - sidechain
 *      - address
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - son_wallet_update
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      payer:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      son_wallet_id:
 *        type: string
 *        pattern: '^(1.35.)\d+$'
 *        example: 1.35.12
 *      sidechain:
 *        $ref: '#/definitions/SidechainType'
 *      address:
 *        type: string
 *        example: mj2hn2k2n39jdnsd7fyahnsdfb8asvdf
 *  SONWalletDepositCreateRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - payer
 *      - son_id
 *      - timestamp
 *      - block_num
 *      - sidechain
 *      - sidechain_uid
 *      - sidechain_transaction_id
 *      - sidechain_from
 *      - sidechain_to
 *      - sidechain_currency
 *      - sidechain_amount
 *      - peerplays_from
 *      - peerplays_to
 *      - peerplays_asset
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - son_wallet_deposit_create
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      payer:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      son_id:
 *        type: string
 *        pattern: '^(1.33.)\d+$'
 *        example: 1.33.12
 *      timestamp:
 *        type: integer
 *        example: 1609896784
 *      block_num:
 *        type: integer
 *        example: 989276272
 *      sidechain:
 *        $ref: '#/definitions/SidechainType'
 *      sidechain_uid:
 *        type: string
 *        example: bitcoin-9b8fd16cc5a3ff37a548ba5ea73dbb3d4609c5793442b096f8757c88c44f693d-0
 *      sidechain_transaction_id:
 *        type: string
 *        example: 9b8fd16cc5a3ff37a548ba5ea73dbb3d4609c5793442b096f8757c88c44f693d
 *      sidechain_from:
 *        type: string
 *        example: 2MxAnE469fhhdvUqUB7daU997VSearb2mn7
 *      sidechain_to:
 *        type: string
 *        example: 2MxAnE469fhhdvUqUB7daU997VSearb2mn7
 *      sidechain_currency:
 *        type: string
 *        example: BTC
 *      sidechain_amount:
 *        $ref: '#/definitions/PeerplaysAmountType'
 *      peerplays_from:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      peerplays_to:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      peerplays_asset:
 *        $ref: '#/definitions/PeerplaysAssetType'
 *  SONWalletDepositProcessRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - payer
 *      - son_wallet_deposit_id
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - son_wallet_deposit_process
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      payer:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      son_wallet_deposit_id:
 *        type: string
 *        pattern: '^(1.36.)\d+$'
 *        example: 1.36.12
 *  SONWalletWithdrawCreateRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - payer
 *      - son_id
 *      - timestamp
 *      - block_num
 *      - sidechain
 *      - peerplays_uid
 *      - peerplays_transaction_id
 *      - peerplays_from
 *      - peerplays_asset
 *      - withdraw_sidechain
 *      - withdraw_address
 *      - withdraw_currency
 *      - withdraw_amount
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - son_wallet_withdraw_create
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      payer:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      son_id:
 *        type: string
 *        pattern: '^(1.33.)\d+$'
 *        example: 1.33.12
 *      timestamp:
 *        type: integer
 *        example: 1609896784
 *      block_num:
 *        type: integer
 *        example: 989276272
 *      sidechain:
 *        $ref: '#/definitions/SidechainType'
 *      peerplays_uid:
 *        type: string
 *        example: peerplays-9b8fd16cc5a3ff37a548ba5ea73dbb3d4609c5793442b096f8757c88c44f693d-0
 *      peerplays_transaction_id:
 *        type: string
 *        example: 9b8fd16cc5a3ff37a548ba5ea73dbb3d4609c5793442b096f8757c88c44f693d
 *      peerplays_from:
 *        type: string
 *        example: 2MxAnE469fhhdvUqUB7daU997VSearb2mn7
 *      peerplays_asset:
 *        $ref: '#/definitions/PeerplaysAssetType'
 *      withdraw_sidechain:
 *        $ref: '#/definitions/SidechainType'
 *      withdraw_address:
 *        type: string
 *        example: 2MxAnE469fhhdvUqUB7daU997VSearb2mn7
 *      withdraw_currency:
 *        type: string
 *        example: BTC
 *      withdraw_amount:
 *        $ref: '#/definitions/PeerplaysAmountType'
 *  SONWalletWithdrawProcessRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - payer
 *      - son_wallet_withdraw_id
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - son_wallet_withdraw_process
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      payer:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      son_wallet_withdraw_id:
 *        type: string
 *        pattern: '^(1.37.)\d+$'
 *        example: 1.37.12
 *  SidechainAddressAddRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - payer
 *      - sidechain_address_account
 *      - sidechain
 *      - deposit_public_key
 *      - deposit_address
 *      - deposit_address_data
 *      - withdraw_public_key
 *      - withdraw_address
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - sidechain_address_add
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      payer:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      sidechain_address_account:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      sidechain:
 *        $ref: '#/definitions/SidechainType'
 *      deposit_public_key:
 *        type: string
 *        example: PPYasdf8hqnwn34j9asdnnfamw9jn34r
 *      deposit_address:
 *        type: string
 *        example: 2MxAnE469fhhdvUqUB7daU997VSearb2mn7
 *      deposit_address_data:
 *        type: string
 *        example: { bitcoin_name: aslam3, peerplays_name: aslam1 }
 *      withdraw_public_key:
 *        type: string
 *        example: PPYasdf8hqnwn34j9asdnnfamw9jn34r
 *      withdraw_address:
 *        type: string
 *        example: 2MxAnE469fhhdvUqUB7daU997VSearb2mn7
 *  SidechainAddressUpdateRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - payer
 *      - sidechain_address_id
 *      - sidechain_address_account
 *      - sidechain
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - sidechain_address_update
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      payer:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      sidechain_address_id:
 *        type: string
 *        pattern: '^(1.38.)\d+$'
 *        example: 1.38.1
 *      sidechain_address_account:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      sidechain:
 *        $ref: '#/definitions/SidechainType'
 *      deposit_public_key:
 *        type: string
 *        example: PPYasdf8hqnwn34j9asdnnfamw9jn34r
 *      deposit_address:
 *        type: string
 *        example: 2MxAnE469fhhdvUqUB7daU997VSearb2mn7
 *      deposit_address_data:
 *        type: string
 *        example: { bitcoin_name: aslam3, peerplays_name: aslam1 }
 *      withdraw_public_key:
 *        type: string
 *        example: PPYasdf8hqnwn34j9asdnnfamw9jn34r
 *      withdraw_address:
 *        type: string
 *        example: 2MxAnE469fhhdvUqUB7daU997VSearb2mn7
 *  SidechainAddressDeleteRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - payer
 *      - sidechain_address_id
 *      - sidechain_address_account
 *      - sidechain
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - sidechain_address_delete
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      payer:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      sidechain_address_id:
 *        type: string
 *        pattern: '^(1.38.)\d+$'
 *        example: 1.38.1
 *      sidechain_address_account:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      sidechain:
 *        $ref: '#/definitions/SidechainType'
 *  SidechainTransactionCreateRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - payer
 *      - sidechain
 *      - object_id
 *      - transaction
 *      - signers
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - sidechain_transaction_create
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      payer:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      sidechain:
 *        $ref: '#/definitions/SidechainType'
 *      object_id:
 *        type: string
 *        example: 1.23.21
 *      transaction:
 *        type: string
 *        example: {}
 *      signers:
 *        type: array
 *        minItems: 1
 *        items:
 *          $ref: '#/definitions/SONInfoType'
 *  SidechainTransactionSignRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - signer
 *      - payer
 *      - sidechain_transaction_id
 *      - signature
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - sidechain_transaction_sign
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      signer:
 *        type: string
 *        pattern: '^(1.33.)\d+$'
 *        example: 1.33.12
 *      payer:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      sidechain_transaction_id:
 *        type: string
 *        pattern: '^(1.39.)\d+$'
 *        example: 1.39.12
 *      signature:
 *        type: string
 *        example: 2kjas8238ja9sdu9hwqoej8ahsidfowd
 *  SidechainTransactionSendRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - payer
 *      - sidechain_transaction_id
 *      - sidechain_transaction
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - sidechain_transaction_send
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      payer:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      sidechain_transaction_id:
 *        type: string
 *        pattern: '^(1.39.)\d+$'
 *        example: 1.39.12
 *      sidechain_transaction:
 *        type: string
 *        example: 2kjas8238ja9sdu9hwqoej8ahsidfowd
 *  SidechainTransactionSettleRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - payer
 *      - sidechain_transaction_id
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - sidechain_transaction_settle
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      payer:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      sidechain_transaction_id:
 *        type: string
 *        pattern: '^(1.39.)\d+$'
 *        example: 1.39.12
 *  NftLotteryRewardRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - lottery_id
 *      - winner
 *      - amount
 *      - win_percentage
 *      - is_benefactor_reward
 *      - winner_ticket_id
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - nft_lottery_reward
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      lottery_id:
 *        type: string
 *        pattern: '^(1.30.)\d+$'
 *        example: 1.30.0
 *      winner:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      amount:
 *        $ref: '#/definitions/PeerplaysAssetType'
 *      win_percentage:
 *        type: integer
 *        example: 5000
 *      is_benefactor_reward:
 *        type: boolean
 *      winner_ticket_id:
 *        type: integer
 *        example: 101
 *  NftLotteryEndRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - lottery_id
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - nft_lottery_end
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      lottery_id:
 *        type: string
 *        pattern: '^(1.30.)\d+$'
 *        example: 1.30.0
 *  RandomNumberStoreRequest:
 *    type: object
 *    required:
 *      - op_name
 *      - fee_asset
 *      - account
 *      - random_number
 *      - data
 *    properties:
 *      op_name:
 *        type: string
 *        enum:
 *          - random_number_store
 *      fee_asset:
 *        $ref: '#/definitions/PeerplaysAssetIDType'
 *      account:
 *        $ref: '#/definitions/PeerplaysAccountIDType'
 *      random_number:
 *        type: array
 *        minItems: 1
 *        items:
 *          type: integer
 *          example: 14
 *      data:
 *        type: string
 *        example: RNG for Rock Paper Scissor
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
  op_name: 'account_update',
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
  max_supply: peerplaysAmountType.required(),
  market_fee_percent: Joi.number().integer().max(10000).required(),
  max_market_fee: Joi.number().integer().max(10000).required(),
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
  winning_tickets: Joi.array().items(Joi.number().integer().max(10000)).required(),
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
  new_options: bitassetOptionsSchema.required()
});

const assetUpdateFeedProducerSchema = Joi.object({
  op_name: 'asset_update_feed_producers',
  fee_asset: peerplaysAssetIdType.required(),
  issuer: peerplaysAccountIdType.required(),
  asset_to_update: peerplaysAssetIdType.required(),
  new_feed_producers: Joi.array().items(peerplaysAccountIdType).min(1).required()
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
  amount: peerplaysAssetType.required()
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
  proposed_ops: Joi.array().items(Joi.object()).min(1).required(),
  review_period_seconds: Joi.number().integer().optional()
});

const proposalUpdateSchema = Joi.object({
  op_name: 'proposal_update',
  fee_asset: peerplaysAssetIdType.required(),
  fee_paying_account: peerplaysAccountIdType.required(),
  proposal: Joi.string().trim().regex(/^(1.10.)\d+$/).required(),
  active_approvals_to_add: Joi.array().items(peerplaysAccountIdType).required(),
  active_approvals_to_remove: Joi.array().items(peerplaysAccountIdType).required(),
  owner_approvals_to_add: Joi.array().items(peerplaysAccountIdType).required(),
  owner_approvals_to_remove: Joi.array().items(peerplaysAccountIdType).required(),
  key_approvals_to_add: Joi.array().items(Joi.string()).required(),
  key_approvals_to_remove: Joi.array().items(Joi.string()).required()
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
  url: Joi.string().uri().required()
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
  daily_pay: peerplaysAmountType.required(),
  name: Joi.string().required(),
  url: Joi.string().uri().required(),
  initializer: Joi.array().length(2).items(Joi.number().integer(), Joi.object()).required()
});

const customSchema = Joi.object({
  op_name: 'custom',
  fee_asset: peerplaysAssetIdType.required(),
  payer: peerplaysAccountIdType.required(),
  required_auths: Joi.array().items(peerplaysAccountIdType).min(1).required(),
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
  }).required()
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
  event_group_id: Joi.string().trim().regex(/^(1.21.)\d+$/).required()
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
  betting_market_id: Joi.string().trim().regex(/^(1.25.)\d+$/).required(),
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
  fee_asset: peerplaysAssetIdType.required(),
  account: peerplaysAccountIdType.required(),
  amount_to_claim: peerplaysAssetType.required()
});

const customPermissionCreateSchema = Joi.object({
  op_name: 'custom_permission_create',
  fee_asset: peerplaysAssetIdType.required(),
  owner_account: peerplaysAccountIdType.required(),
  permission_name: Joi.string().max(10).required(),
  auth: authoritySchema.required()
});

const customPermissionUpdateSchema = Joi.object({
  op_name: 'custom_permission_update',
  fee_asset: peerplaysAssetIdType.required(),
  permission_id: Joi.string().trim().regex(/^(1.27.)\d+$/).required(),
  new_auth: authoritySchema.required(),
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
  offer_id: Joi.string().trim().regex(/^(1.29.)\d+$/).required(),
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
  withdraw_amount: peerplaysAmountType.required()
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
