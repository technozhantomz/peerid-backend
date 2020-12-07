class OperationUtil {
  static queryToOperationJson(op) {
    let opJson = [];

    for(let i = 0; i < op.length; i++) {
      switch(op[i].op_name) {
        case 'transfer':
          opJson.push([
            'transfer', {
              fee: {
                amount: 0,
                asset_id: op[i].fee_asset
              },
              from: op[i].from,
              to: op[i].to,
              amount: op[i].amount,
              memo: op[i].memo,
              extensions: null
            }
          ]);
          break;
        case 'limit_order_create': 
          opJson.push([
            'limit_order_create', {
              fee: {
                amount: 0,
                asset_id: op[i].fee_asset
              },
              seller: op[i].seller,
              amount_to_sell: op[i].amount_to_sell,
              min_to_receive: op[i].min_to_receive,
              expiration: op[i].expiration.getTime(),
              fill_or_kill: op[i].fill_or_kill,
              extensions: null
            }
          ]);
          break;
        case 'limit_order_cancel': 
          opJson.push([
            'limit_order_cancel', {
              fee: {
                amount: 0,
                asset_id: op[i].fee_asset
              },
              fee_paying_account: op[i].fee_paying_account,
              order: op[i].order,
              extensions: null
            }
          ]);
          break;
        case 'call_order_update': 
          opJson.push([
            'call_order_update', {
              fee: {
                amount: 0,
                asset_id: op[i].fee_asset
              },
              funding_account: op[i].funding_account,
              delta_collateral: op[i].delta_collateral,
              delta_debt: op[i].delta_debt,
              extensions: null
            }
          ]);
          break;
        case 'fill_order':
          opJson.push([
            'fill_order', {
              fee: {
                amount: 0,
                asset_id: op[i].fee_asset
              },
              order_id: op[i].order_id,
              account_id: op[i].account_id,
              pays: op[i].pays,
              receives: op[i].receives,
              extensions: null
            }
          ]);
          break;
        case 'account_create':
          opJson.push([
            'account_create', {
              fee: {
                amount: 0,
                asset_id: op[i].fee_asset
              },
              registrar: op[i].registrar,
              referrer: op[i].referrer,
              referrer_percent: op[i].referrer_percent,
              name: op[i].name,
              owner: op[i].owner,
              active: op[i].active,
              options: {
                ...op[i].options,
                extensions: null
              },
              extensions: null
            }
          ]);
          break;

        case 'account_update': {
          let operation = {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            account: op[i].account,
            extensions: [{
              value: {
                update_last_voting_time: op[i].update_last_voting_time
              }
            }]
          };

          if(op[i].hasOwnProperty('owner')) {
            operation.owner = op[i].owner;
          }

          if(op[i].hasOwnProperty('active')) {
            operation.active = op[i].active;
          }

          if(op[i].hasOwnProperty('new_options')) {
            operation.new_options = {
              ...op[i].new_options,
              extensions: null
            };
          }

          opJson.push(['account_update', operation]);
          break;
        }

        case 'account_whitelist':
          opJson.push([
            'account_whitelist', {
              fee: {
                amount: 0,
                asset_id: op[i].fee_asset
              },
              authorizing_account: op[i].authorizing_account,
              account_to_list: op[i].account_to_list,
              new_listing: op[i].new_listing,
              extensions: null
            }
          ]);
          break;
        case 'account_upgrade':
          opJson.push([
            'account_upgrade', {
              fee: {
                amount: 0,
                asset_id: op[i].fee_asset
              },
              account_to_upgrade: op[i].account_to_upgrade,
              upgrade_to_lifetime_member: op[i].upgrade_to_lifetime_member,
              extensions: null
            }
          ]);
          break;
        case 'account_transfer':
          opJson.push([
            'account_transfer', {
              fee: {
                amount: 0,
                asset_id: op[i].fee_asset
              },
              account_id: op[i].account_id,
              new_owner: op[i].new_owner,
              extensions: null
            }
          ]);
          break;

        case 'asset_create': {
          let operation = {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            issuer: op[i].issuer,
            symbol: op[i].symbol,
            precision: op[i].precision,
            common_options: {
              ...op[i].common_options,
              extensions: null
            },
            is_prediction_market: op[i].is_prediction_market,
            extensions: null
          };

          if(op[i].hasOwnProperty('bitasset_options')) {
            operation.bitasset_opts = {
              ...op[i].bitasset_opts,
              extensions: null
            };
          }

          opJson.push(['asset_create', operation]);
          break;
        }

        case 'asset_update': {
          let operation = {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            issuer: op[i].issuer,
            asset_to_update: op[i].asset_to_update,
            new_options: {
              ...op[i].new_options,
              extensions: null
            },
            extensions: null
          };

          if(op[i].hasOwnProperty('new_issuer')) {
            operation.new_issuer = op[i].new_issuer;
          }

          opJson.push(['asset_update', operation]);
          break;
        }

        case 'asset_update_bitasset':
          opJson.push(['asset_update_bitasset',{
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            issuer: op[i].issuer,
            asset_to_update: op[i].asset_to_update,
            new_options: {
              ...op[i].new_options,
              extensions: null
            },
            extensions: null
          }]);
          break;
        case 'asset_update_feed_producers':
          opJson.push(['asset_update_feed_producers',{
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            issuer: op[i].issuer,
            asset_to_update: op[i].asset_to_update,
            new_feed_producers: op[i].new_feed_producers,
            extensions: null
          }]);
          break;
        case 'asset_issue':
          opJson.push(['asset_issue',{
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            issuer: op[i].issuer,
            asset_to_issue: op[i].asset_to_issue,
            issue_to_account: op[i].issue_to_account,
            extensions: null
          }]);
          break;
        case 'asset_reserve':
          opJson.push(['asset_reserve',{
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            payer: op[i].payer,
            amount_to_reserve: op[i].amount_to_reserve,
            extensions: null
          }]);
          break;
        case 'asset_fund_fee_pool':
          opJson.push(['asset_fund_fee_pool',{
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            from_account: op[i].from_account,
            asset_id: op[i].asset_id,
            amount: op[i].amount,
            extensions: null
          }]);
          break;
        case 'asset_settle':
          opJson.push(['asset_settle',{
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            account: op[i].account,
            amount: op[i].amount,
            extensions: null
          }]);
          break;
        case 'asset_global_settle':
          opJson.push(['asset_global_settle',{
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            issuer: op[i].issuer,
            asset_to_settle: op[i].asset_to_settle,
            settle_price: op[i].settle_price,
            extensions: null
          }]);
          break;
        case 'asset_publish_feed':
          opJson.push(['asset_publish_feed',{
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            publisher: op[i].publisher,
            asset_id: op[i].asset_id,
            feed: op[i].feed,
            extensions: null
          }]);
          break;
        case 'witness_create':
          opJson.push(['witness_create',{
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            witness_account: op[i].witness_account,
            url: op[i].url,
            block_signing_key: op[i].block_signing_key,
            initial_secret: Buffer.from(op[i].initial_secret, 'base64'),
            extensions: null
          }]);
          break;

        case 'witness_update': {
          let operation = {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            witness: op[i].witness,
            witness_account: op[i].witness_account,
            extensions: null
          };

          if(op[i].hasOwnProperty('new_url')) {
            operation.new_url = op[i].new_url;
          }

          if(op[i].hasOwnProperty('new_signing_key')) {
            operation.new_signing_key = op[i].new_signing_key;
          }

          if(op[i].hasOwnProperty('new_initial_secret')) {
            operation.new_initial_secret = Buffer.from(op[i].new_initial_secret, 'base64');
          }

          opJson.push(['witness_update', operation]);
          break;
        }

        case 'proposal_create': {
          let operation = {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            fee_paying_account: op[i].fee_paying_account,
            expiration_time: op[i].expiration_time.getTime(),
            proposed_ops: op[i].proposed_ops,
            extensions: null
          };

          if(op[i].hasOwnProperty('review_period_seconds')) {
            operation.review_period_seconds = op[i].review_period_seconds;
          }

          opJson.push(['proposal_create', operation]);
          break;
        }

        case 'proposal_update':
          opJson.push(['proposal_update',{
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            fee_paying_account: op[i].fee_paying_account,
            proposal: op[i].proposal,
            active_approvals_to_add: op[i].active_approvals_to_add,
            active_approvals_to_remove: op[i].active_approvals_to_remove,
            owner_approvals_to_add: op[i].owner_approvals_to_add,
            owner_approvals_to_remove: op[i].owner_approvals_to_remove,
            key_approvals_to_add: op[i].key_approvals_to_add,
            key_approvals_to_remove: op[i].key_approvals_to_remove,
            extensions: null
          }]);
          break;
        case 'proposal_delete':
          opJson.push(['proposal_delete',{
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            fee_paying_account: op[i].fee_paying_account,
            using_owner_authority: op[i].using_owner_authority,
            proposal: op[i].proposal,
            extensions: null
          }]);
          break;
        case 'withdraw_permission_create':
          opJson.push(['withdraw_permission_create',{
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            withdraw_from_account: op[i].withdraw_from_account,
            authorized_account: op[i].authorized_account,
            withdrawal_limit: op[i].withdrawal_limit,
            withdrawal_period_sec: op[i].withdrawal_period_sec,
            periods_until_expiration: op[i].periods_until_expiration,
            period_start_time: op[i].period_start_time.getTime()
          }]);
          break;
        case 'withdraw_permission_update':
          opJson.push(['withdraw_permission_update',{
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            withdraw_from_account: op[i].withdraw_from_account,
            authorized_account: op[i].authorized_account,
            permission_to_update: op[i].permission_to_update,
            withdrawal_limit: op[i].withdrawal_limit,
            withdrawal_period_sec: op[i].withdrawal_period_sec,
            period_start_time: op[i].period_start_time.getTime(),
            periods_until_expiration: op[i].periods_until_expiration
          }]);
          break;
        case 'withdraw_permission_claim':
          opJson.push(['withdraw_permission_claim',{
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            withdraw_permission: op[i].withdraw_permission,
            withdraw_from_account: op[i].withdraw_from_account,
            withdraw_to_account: op[i].withdraw_to_account,
            amount_to_withdraw: op[i].amount_to_withdraw
          }]);
          break;
        case 'withdraw_permission_delete':
          opJson.push(['withdraw_permission_delete',{
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            withdraw_from_account: op[i].withdraw_from_account,
            authorized_account: op[i].authorized_account,
            withdrawal_permission: op[i].withdrawal_permission
          }]);
          break;
        case 'committee_member_create':
          opJson.push(['committee_member_create',{
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            committee_member_account: op[i].committee_member_account,
            url: op[i].url
          }]);
          break;

        case 'committee_member_update': {
          let operation = {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            committee_member: op[i].committee_member,
            committee_member_account: op[i].committee_member_account
          };

          if(op[i].hasOwnProperty('new_url')) {
            operation.new_url = op[i].new_url;
          }

          opJson.push(['committee_member_update', operation]);
          break;
        }

        case 'committee_member_update_global_parameters':
          opJson.push(['committee_member_update_global_parameters', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            new_parameters: op[i].new_parameters
          }]);
          break;
        case 'vesting_balance_create':
          opJson.push(['vesting_balance_create', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            creator: op[i].creator,
            owner: op[i].owner,
            amount: op[i].amount,
            policy: op[i].policy,
            balance_type: op[i].balance_type
          }]);
          break;
        case 'vesting_balance_withdraw':
          opJson.push(['vesting_balance_withdraw', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            vesting_balance: op[i].vesting_balance,
            owner: op[i].owner,
            amount: op[i].amount
          }]);
          break;
        case 'worker_create':
          opJson.push(['worker_create', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            owner: op[i].owner,
            work_begin_date: op[i].work_begin_date.getTime(),
            work_end_date: op[i].work_end_date.getTime(),
            daily_pay: op[i].daily_pay,
            name: op[i].name,
            url: op[i].url,
            initializer: op[i].initializer
          }]);
          break;
        case 'custom':
          opJson.push(['custom', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            payer: op[i].payer,
            required_auths: op[i].required_auths,
            id: op[i].id,
            data: Buffer.from(op[i].data, 'base64')
          }]);
          break;
        case 'assert':
          opJson.push(['assert', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            fee_paying_account: op[i].fee_paying_account,
            predicates: op[i].predicates,
            required_auths: op[i].required_auths,
            extensions: null
          }]);
          break;
        case 'balance_claim':
          opJson.push(['balance_claim', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            deposit_to_account: op[i].deposit_to_account,
            balance_to_claim: op[i].balance_to_claim,
            balance_owner_key: op[i].balance_owner_key,
            total_claimed: op[i].total_claimed
          }]);
          break;
        case 'override_transfer':
          opJson.push(['override_transfer', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            issuer: op[i].issuer,
            from: op[i].from,
            to: op[i].to,
            amount: op[i].amount,
            extensions: null
          }]);
          break;
        case 'transfer_to_blind':
          opJson.push(['transfer_to_blind', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            amount: op[i].amount,
            from: op[i].from,
            blinding_factor: op[i].blinding_factor,
            outputs: op[i].outputs
          }]);
          break;
        case 'blind_transfer':
          opJson.push(['blind_transfer', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            inputs: op[i].inputs,
            outputs: op[i].outputs
          }]);
          break;
        case 'transfer_from_blind':
          opJson.push(['transfer_from_blind', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            amount: op[i].amount,
            to: op[i].to,
            blinding_factor: op[i].blinding_factor,
            inputs: op[i].inputs
          }]);
          break;
        case 'asset_settle_cancel':
          opJson.push(['asset_settle_cancel', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            settlement: op[i].settlement,
            account: op[i].account,
            amount: op[i].amount,
            extensions: null
          }]);
          break;
        case 'asset_claim_fees':
          opJson.push(['asset_claim_fees', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            issuer: op[i].issuer,
            amount_to_claim: op[i].amount_to_claim,
            extensions: null
          }]);
          break;
        case 'fba_distribute':
          opJson.push(['fba_distribute', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            account_id: op[i].account_id,
            fba_id: op[i].fba_id,
            amount: op[i].amount
          }]);
          break;

        case 'tournament_create': {
          let operation = {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            creator: op[i].creator,
            options: {
              ...op[i].options,
              registration_deadline: op[i].options.registration_deadline.getTime()
            },
            extensions: null
          };

          opJson.push(['tournament_create', operation]);
          break;
        }

        case 'tournament_join':
          opJson.push(['tournament_join', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            payer_account_id: op[i].payer_account_id,
            player_account_id: op[i].player_account_id,
            tournament_id: op[i].tournament_id,
            buy_in: op[i].buy_in,
            extensions: null
          }]);
          break;

        case 'nft_metadata_create': {
          let operation = {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            owner: op[i].owner,
            name: op[i].name,
            symbol: op[i].symbol,
            base_uri: op[i].base_uri,
            is_transferable: op[i].is_transferable,
            is_sellable: op[i].is_sellable,
            extensions: null
          };

          if(op[i].hasOwnProperty('revenue_partner')) {
            operation.revenue_partner = op[i].revenue_partner;
          }

          if(op[i].hasOwnProperty('revenue_split')) {
            operation.revenue_split = op[i].revenue_split;
          }

          if(op[i].hasOwnProperty('account_role')) {
            operation.account_role = op[i].account_role;
          }

          if(op[i].hasOwnProperty('max_supply')) {
            operation.max_supply = op[i].max_supply;
          }

          if(op[i].hasOwnProperty('lottery_options')) {
            operation.lottery_options = {
              benefactors: op[i].lottery_options.benefactors,
              winning_tickets: op[i].lottery_options.winning_tickets,
              ticket_price: op[i].lottery_options.ticket_price,
              end_date: op[i].lottery_options.end_date.getTime(),
              ending_on_soldout: op[i].lottery_options.ending_on_soldout,
              is_active: op[i].lottery_options.is_active,
              delete_tickets_after_draw: op[i].lottery_options.delete_tickets_after_draw,
              progressive_jackpots: op[i].lottery_options.progressive_jackpots
            };
          }

          opJson.push(['nft_metadata_create', operation]);
          break;
        }

        case 'nft_metadata_update': {
          let operation = {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            owner: op[i].owner,
            nft_metadata_id: op[i].nft_metadata_id,
            extensions: null
          };

          if(op[i].hasOwnProperty('name')) {
            operation.name = op[i].name;
          }

          if(op[i].hasOwnProperty('symbol')) {
            operation.symbol = op[i].symbol;
          }

          if(op[i].hasOwnProperty('base_uri')) {
            operation.base_uri = op[i].base_uri;
          }

          if(op[i].hasOwnProperty('revenue_partner')) {
            operation.revenue_partner = op[i].revenue_partner;
          }

          if(op[i].hasOwnProperty('revenue_split')) {
            operation.revenue_split = op[i].revenue_split;
          }

          if(op[i].hasOwnProperty('is_transferable')) {
            operation.is_transferable = op[i].is_transferable;
          }

          if(op[i].hasOwnProperty('is_sellable')) {
            operation.is_sellable = op[i].is_sellable;
          }

          if(op[i].hasOwnProperty('account_role')) {
            operation.account_role = op[i].account_role;
          }

          opJson.push(['nft_metadata_update', operation]);
          break;
        }

        case 'nft_mint':
          opJson.push([
            'nft_mint', {
              fee: {
                amount: 0,
                asset_id: op[i].fee_asset
              },
              payer: op[i].payer,
              nft_metadata_id: op[i].nft_metadata_id,
              owner: op[i].owner,
              approved: op[i].approved,
              approved_operators: op[i].approved_operators,
              token_uri: op[i].token_uri,
              extensions: null
            }
          ]);
          break;
        case 'nft_safe_transfer_from':
          opJson.push([
            'nft_safe_transfer_from', {
              fee: {
                amount: 0,
                asset_id: op[i].fee_asset
              },
              operator_: op[i].operator_,
              from: op[i].from,
              to: op[i].to,
              token_id: op[i].token_id,
              data: op[i].data,
              extensions: null
            }
          ]);
          break;
        case 'nft_approve':
          opJson.push([
            'nft_approve', {
              fee: {
                amount: 0,
                asset_id: op[i].fee_asset
              },
              operator_: op[i].operator_,
              approved: op[i].approved,
              token_id: op[i].token_id,
              extensions: null
            }
          ]);
          break;
        case 'nft_set_approval_for_all':
          opJson.push([
            'nft_set_approval_for_all', {
              fee: {
                amount: 0,
                asset_id: op[i].fee_asset
              },
              owner: op[i].owner,
              operator_: op[i].operator_,
              approved: op[i].approved,
              extensions: null
            }
          ]);
          break;
        case 'offer':
          opJson.push([
            'offer', {
              fee: {
                amount: 0,
                asset_id: op[i].fee_asset
              },
              item_ids: op[i].item_ids,
              issuer: op[i].issuer,
              minimum_price: op[i].minimum_price,
              maximum_price: op[i].maximum_price,
              buying_item: op[i].buying_item,
              offer_expiration_date: op[i].offer_expiration_date.getTime(),
              extensions: null
            }
          ]);
          break;
        case 'bid':
          opJson.push([
            'bid', {
              fee: {
                amount: 0,
                asset_id: op[i].fee_asset
              },
              bidder: op[i].bidder,
              bid_price: op[i].bid_price,
              offer_id: op[i].offer_id,
              extensions: null
            }
          ]);
          break;
        case 'cancel_offer':
          opJson.push([
            'cancel_offer', {
              fee: {
                amount: 0,
                asset_id: op[i].fee_asset
              },
              issuer: op[i].issuer,
              offer_id: op[i].offer_id,
              extensions: null
            }
          ]);
          break;
        case 'nft_lottery_token_purchase':
          opJson.push([
            'nft_lottery_token_purchase', {
              fee: {
                amount: 0,
                asset_id: op[i].fee_asset
              },
              lottery_id: op[i].lottery_id,
              buyer: op[i].buyer,
              tickets_to_buy: op[i].tickets_to_buy,
              amount: op[i].amount,
              extensions: null
            }
          ]);
          break;
        default:
          break;
      }
    }

    return opJson;
  }
}

module.exports = OperationUtil;