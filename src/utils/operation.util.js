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

          if(op[i].options.hasOwnProperty('start_time')) {
            operation.options.start_time = op[i].options.start_time.getTime();
          }

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

        case 'game_move':
          opJson.push(['game_move', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            game_id: op[i].game_id,
            player_account_id: op[i].player_account_id,
            move: op[i].move,
            extensions: null
          }]);
          break;

        case 'asset_update_dividend': {
          let operation = {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            issuer: op[i].issuer,
            asset_to_update: op[i].asset_to_update,
            new_options: {
              ...op[i].new_options
            },
            extensions: null
          };

          if(op[i].new_options.hasOwnProperty('next_payout_time')) {
            operation.new_options.next_payout_time = op[i].new_options.next_payout_time.getTime();
          }

          opJson.push(['asset_update_dividend'], operation);
          break;
        }

        case 'asset_dividend_distribution':
          opJson.push(['asset_dividend_distribution', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            dividend_asset_id: op[i].dividend_asset_id,
            account_id: op[i].account_id,
            amounts: op[i].amounts,
            extensions: null
          }]);
          break;
        case 'sport_create':
          opJson.push(['sport_create', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            name: op[i].name,
            extensions: null
          }]);
          break;

        case 'sport_update': {
          let operation = {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            sport_id: op[i].sport_id,
            extensions: null
          };

          if(op[i].hasOwnProperty('new_name')) {
            operation.new_name = op[i].new_name;
          }

          opJson.push(['sport_update', operation]);
          break;
        }

        case 'event_group_create':
          opJson.push(['event_group_create', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            name: op[i].name,
            sport_id: op[i].sport_id,
            extensions: null
          }]);
          break;

        case 'event_group_update': {
          let operation = {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            event_group_id: op[i].event_group_id,
            extensions: null
          };

          if(op[i].hasOwnProperty('new_sport_id')) {
            operation.new_sport_id = op[i].new_sport_id;
          }

          if(op[i].hasOwnProperty('new_name')) {
            operation.new_name = op[i].new_name;
          }

          opJson.push(['event_group_update', operation]);
          break;
        }

        case 'event_create': {
          let operation = {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            name: op[i].name,
            season: op[i].season,
            event_group_id: op[i].event_group_id,
            extensions: null
          };

          if(op[i].hasOwnProperty('start_time')) {
            operation.start_time = op[i].start_time.getTime();
          }

          opJson.push(['event_create', operation]);
          break;
        }

        case 'event_update': {
          let operation = {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            event_id: op[i].event_id,
            extensions: null
          };

          if(op[i].hasOwnProperty('new_event_group_id')) {
            operation.new_event_group_id = op[i].new_event_group_id;
          }

          if(op[i].hasOwnProperty('new_name')) {
            operation.new_name = op[i].new_name;
          }

          if(op[i].hasOwnProperty('new_season')) {
            operation.new_season = op[i].new_season;
          }

          if(op[i].hasOwnProperty('new_start_time')) {
            operation.new_start_time = op[i].new_start_time.getTime();
          }

          if(op[i].hasOwnProperty('is_live_market')) {
            operation.is_live_market = op[i].is_live_market;
          }

          opJson.push(['event_update', operation]);
          break;
        }

        case 'betting_market_rules_create':
          opJson.push(['betting_market_rules_create', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            name: op[i].name,
            description: op[i].description,
            extensions: null
          }]);
          break;

        case 'betting_market_rules_update': {
          let operation = {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            betting_market_rules_id: op[i].betting_market_rules_id,
            extensions: null
          };

          if(op[i].hasOwnProperty('new_name')) {
            operation.new_name = op[i].new_name;
          }

          if(op[i].hasOwnProperty('new_description')) {
            operation.new_description = op[i].new_description;
          }

          opJson.push(['betting_market_rules_update', operation]);
          break;
        }

        case 'betting_market_group_create':
          opJson.push(['betting_market_group_create', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            description: op[i].description,
            event_id: op[i].event_id,
            rules_id: op[i].rules_id,
            asset_id: op[i].asset_id,
            extensions: null
          }]);
          break;
        case 'betting_market_create':
          opJson.push(['betting_market_create', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            group_id: op[i].group_id,
            description: op[i].description,
            payout_condition: op[i].payout_condition,
            extensions: null
          }]);
          break;
        case 'bet_place':
          opJson.push(['bet_place', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            bettor_id: op[i].bettor_id,
            betting_market_id: op[i].betting_market_id,
            amount_to_bet: op[i].amount_to_bet,
            backer_multiplier: op[i].backer_multiplier,
            back_or_lay: op[i].back_or_lay,
            extensions: null
          }]);
          break;
        case 'betting_market_group_resolve':
          opJson.push(['betting_market_group_resolve', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            betting_market_group_id: op[i].betting_market_group_id,
            resolutions: op[i].resolutions,
            extensions: null
          }]);
          break;
        case 'betting_market_group_resolved':
          opJson.push(['betting_market_group_resolved', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            bettor_id: op[i].bettor_id,
            betting_market_group_id: op[i].betting_market_group_id,
            resolutions: op[i].resolutions,
            winnings: op[i].winnings,
            fees_paid: op[i].fees_paid
          }]);
          break;
        case 'betting_market_group_cancel_unmatched_bets':
          opJson.push(['betting_market_group_cancel_unmatched_bets', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            betting_market_group_id: op[i].betting_market_group_id,
            extensions: null
          }]);
          break;
        case 'bet_matched':
          opJson.push(['bet_matched', {
            bettor_id: op[i].bettor_id,
            bet_id: op[i].bet_id,
            betting_market_id: op[i].betting_market_id,
            amount_bet: op[i].amount_bet,
            fees_paid: op[i].fees_paid,
            backer_multiplier: op[i].backer_multiplier,
            guaranteed_winnings_returned: op[i].guaranteed_winnings_returned
          }]);
          break;
        case 'bet_cancel':
          opJson.push(['bet_cancel', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            bettor_id: op[i].bettor_id,
            bet_to_cancel: op[i].bet_to_cancel,
            extensions: null
          }]);
          break;
        case 'bet_canceled':
          opJson.push(['bet_canceled', {
            bettor_id: op[i].bettor_id,
            bet_id: op[i].bet_id,
            stake_returned: op[i].stake_returned,
            unused_fees_returned: op[i].unused_fees_returned
          }]);
          break;
        case 'tournament_payout':
          opJson.push(['tournament_payout', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            payout_account_id: op[i].payout_account_id,
            tournament_id: op[i].tournament_id,
            payout_amount: op[i].payout_amount,
            type: op[i].type,
            extensions: null
          }]);
          break;
        case 'tournament_leave':
          opJson.push(['tournament_leave', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            canceling_account_id: op[i].canceling_account_id,
            player_account_id: op[i].player_account_id,
            tournament_id: op[i].tournament_id,
            extensions: null
          }]);
          break;

        case 'betting_market_group_update': {
          let operation = {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            betting_market_group_id: op[i].betting_market_group_id,
            extensions: null
          };

          if(op[i].hasOwnProperty('new_description')) {
            operation.new_description = op[i].new_description;
          }

          if(op[i].hasOwnProperty('new_rules_id')) {
            operation.new_rules_id = op[i].new_rules_id;
          }

          if(op[i].hasOwnProperty('freeze')) {
            operation.freeze = op[i].freeze;
          }

          if(op[i].hasOwnProperty('delay_bets')) {
            operation.delay_bets = op[i].delay_bets;
          }

          opJson.push(['betting_market_group_update', operation]);
          break;
        }

        case 'betting_market_update': {
          let operation = {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            betting_market_id: op[i].betting_market_id,
            extensions: null
          };

          if(op[i].hasOwnProperty('new_group_id')) {
            operation.new_group_id = op[i].new_group_id;
          }

          if(op[i].hasOwnProperty('new_description')) {
            operation.new_description = op[i].new_description;
          }

          if(op[i].hasOwnProperty('new_payout_condition')) {
            operation.new_payout_condition = op[i].new_payout_condition;
          }

          opJson.push(['betting_market_update', operation]);
          break;
        }

        case 'bet_adjusted':
          opJson.push(['bet_adjusted', {
            bettor_id: op[i].bettor_id,
            bet_id: op[i].bet_id,
            stake_returned: op[i].stake_returned
          }]);
          break;

        case 'lottery_asset_create': {
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
            extensions: op[i].extensions
          };

          if(op[i].hasOwnProperty('bitasset_options')) {
            operation.bitasset_opts = {
              ...op[i].bitasset_opts,
              extensions: null
            };
          }

          opJson.push(['lottery_asset_create', operation]);
          break;
        }

        case 'ticket_purchase':
          opJson.push(['ticket_purchase', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            lottery: op[i].lottery,
            buyer: op[i].buyer,
            tickets_to_buy: op[i].tickets_to_buy,
            amount: op[i].amount,
            extensions: null
          }]);
          break;
        case 'lottery_reward':
          opJson.push(['lottery_reward', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            lottery: op[i].lottery,
            winner: op[i].winner,
            amount: op[i].amount,
            win_percentage: op[i].win_percentage,
            is_benefactor_reward: op[i].is_benefactor_reward,
            extensions: null
          }]);
          break;
        case 'lottery_end':
          opJson.push(['lottery_end', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            lottery: op[i].lottery,
            participants: op[i].participants,
            extensions: null
          }]);
          break;
        case 'sweeps_vesting_claim':
          opJson.push(['sweeps_vesting_claim', {
            account: op[i].account,
            amount_to_claim: op[i].amount_to_claim,
            extensions: null
          }]);
          break;
        case 'custom_permission_create':
          opJson.push(['custom_permission_create', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            owner_account: op[i].owner_account,
            permission_name: op[i].permission_name,
            auth: op[i].auth,
            extensions: null
          }]);
          break;
        case 'custom_permission_update':
          opJson.push(['custom_permission_update', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            permission_id: op[i].permission_id,
            new_auth: op[i].new_auth,
            owner_account: op[i].owner_account,
            extensions: null
          }]);
          break;
        case 'custom_permission_delete':
          opJson.push(['custom_permission_delete', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            permission_id: op[i].permission_id,
            owner_account: op[i].owner_account,
            extensions: null
          }]);
          break;
        case 'custom_account_authority_create':
          opJson.push(['custom_account_authority_create', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            permission_id: op[i].permission_id,
            operation_type: op[i].operation_type,
            valid_from: op[i].valid_from.getTime(),
            valid_to: op[i].valid_to.getTime(),
            owner_account: op[i].owner_account,
            extensions: null
          }]);
          break;

        case 'custom_account_authority_update': {
          let operation = {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            auth_id: op[i].auth_id,
            owner_account: op[i].owner_account,
            extensions: null
          };

          if(op[i].hasOwnProperty('new_valid_from')) {
            operation.new_valid_from = op[i].new_valid_from.getTime();
          }

          if(op[i].hasOwnProperty('new_valid_to')) {
            operation.new_valid_to = op[i].new_valid_to.getTime();
          }

          opJson.push(['custom_account_authority_update', operation ]);
          break;
        }

        case 'custom_account_authority_delete':
          opJson.push(['custom_account_authority_delete', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            owner_account: op[i].owner_account,
            extensions: null
          }]);
          break;
        case 'finalize_offer':
          opJson.push(['finalize_offer', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            fee_paying_account: op[i].fee_paying_account,
            offer_id: op[i].offer_id,
            result: op[i].result,
            extensions: null
          }]);
          break;
        case 'account_role_create':
          opJson.push(['account_role_create', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            owner: op[i].owner,
            name: op[i].name,
            metadata: op[i].metadata,
            allowed_operations: op[i].allowed_operations,
            whitelisted_accounts: op[i].whitelisted_accounts,
            valid_from: op[i].valid_from.getTime(),
            extensions: null
          }]);
          break;

        case 'account_role_update': {
          let operation = {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            owner: op[i].owner,
            account_role_id: op[i].account_role_id,
            allowed_operations_to_add: op[i].allowed_operations_to_add,
            allowed_operations_to_remove: op[i].allowed_operations_to_remove,
            accounts_to_add: op[i].accounts_to_add,
            accounts_to_remove: op[i].accounts_to_remove,
            extensions: null
          };

          if(op[i].hasOwnProperty('name')) {
            operation.name = op[i].name;
          }

          if(op[i].hasOwnProperty('metadata')) {
            operation.metadata = op[i].metadata;
          }

          if(op[i].hasOwnProperty('valid_to')) {
            operation.valid_to = op[i].valid_to.getTime();
          }

          opJson.push(['account_role_update', operation ]);
          break;
        }

        case 'account_role_delete':
          opJson.push(['account_role_delete', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            owner: op[i].owner,
            account_role_id: op[i].account_role_id,
            extensions: null
          }]);
          break;
        case 'son_create':
          opJson.push(['son_create', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            owner_account: op[i].owner_account,
            url: op[i].url,
            deposit: op[i].deposit,
            signing_key: op[i].signing_key,
            sidechain_public_keys: op[i].sidechain_public_keys,
            pay_vb: op[i].pay_vb
          }]);
          break;

        case 'son_update': {
          let operation = {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            son_id: op[i].son_id,
            owner_account: op[i].owner_account
          };

          if(op[i].hasOwnProperty('new_url')) {
            operation.new_url = op[i].new_url;
          }

          if(op[i].hasOwnProperty('new_deposit')) {
            operation.new_deposit = op[i].new_deposit;
          }

          if(op[i].hasOwnProperty('new_signing_key')) {
            operation.new_signing_key = op[i].new_signing_key;
          }

          if(op[i].hasOwnProperty('new_sidechain_public_keys')) {
            operation.new_sidechain_public_keys = op[i].new_sidechain_public_keys;
          }

          if(op[i].hasOwnProperty('new_pay_vb')) {
            operation.new_pay_vb = op[i].new_pay_vb;
          }

          opJson.push(['son_update', operation ]);
          break;
        }

        case 'son_deregister':
          opJson.push(['son_deregister', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            son_id: op[i].son_id,
            payer: op[i].payer
          }]);
          break;
        case 'son_heartbeat':
          opJson.push(['son_heartbeat', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            son_id: op[i].son_id,
            owner_account: op[i].owner_account,
            ts: op[i].ts.getTime()
          }]);
          break;
        case 'son_report_down':
          opJson.push(['son_report_down', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            son_id: op[i].son_id,
            payer: op[i].payer,
            down_ts: op[i].down_ts.getTime()
          }]);
          break;
        case 'son_maintenance':
          opJson.push(['son_maintenance', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            son_id: op[i].son_id,
            owner_account: op[i].owner_account,
            request_type: op[i].request_type
          }]);
          break;
        case 'son_wallet_recreate':
          opJson.push(['son_wallet_recreate', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            payer: op[i].payer,
            sons: op[i].sons
          }]);
          break;
        case 'son_wallet_update':
          opJson.push(['son_wallet_update', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            payer: op[i].payer,
            son_wallet_id: op[i].son_wallet_id,
            sidechain: op[i].sidechain,
            address: op[i].address
          }]);
          break;
        case 'son_wallet_deposit_create':
          opJson.push(['son_wallet_deposit_create', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            payer: op[i].payer,
            son_id: op[i].son_id,
            timestamp: op[i].timestamp.getTime(),
            block_num: op[i].block_num,
            sidechain: op[i].sidechain,
            sidechain_uid: op[i].sidechain_uid,
            sidechain_transaction_id: op[i].sidechain_transaction_id,
            sidechain_from: op[i].sidechain_from,
            sidechain_to: op[i].sidechain_to,
            sidechain_currency: op[i].sidechain_currency,
            sidechain_amount: op[i].sidechain_amount,
            peerplays_from: op[i].peerplays_from,
            peerplays_to: op[i].peerplays_to,
            peerplays_asset: op[i].peerplays_asset
          }]);
          break;
        case 'son_wallet_deposit_process':
          opJson.push(['son_wallet_deposit_process', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            payer: op[i].payer,
            son_wallet_deposit_id: op[i].son_wallet_deposit_id
          }]);
          break;
        case 'son_wallet_withdraw_create':
          opJson.push(['son_wallet_withdraw_create', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            payer: op[i].payer,
            son_id: op[i].son_id,
            timestamp: op[i].timestamp.getTime(),
            block_num: op[i].block_num,
            sidechain: op[i].sidechain,
            peerplays_uid: op[i].peerplays_uid,
            peerplays_transaction_id: op[i].peerplays_transaction_id,
            peerplays_from: op[i].peerplays_from,
            peerplays_asset: op[i].peerplays_asset,
            withdraw_sidechain: op[i].withdraw_sidechain,
            withdraw_address: op[i].withdraw_address,
            withdraw_currency: op[i].withdraw_currency,
            withdraw_amount: op[i].withdraw_amount
          }]);
          break;
        case 'son_wallet_withdraw_process':
          opJson.push(['son_wallet_withdraw_process', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            payer: op[i].payer,
            son_wallet_withdraw_id: op[i].son_wallet_withdraw_id
          }]);
          break;
        case 'sidechain_address_add':
          opJson.push(['sidechain_address_add', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            payer: op[i].payer,
            sidechain_address_account: op[i].sidechain_address_account,
            sidechain: op[i].sidechain,
            deposit_public_key: op[i].deposit_public_key,
            deposit_address: op[i].deposit_address,
            deposit_address_data: op[i].deposit_address_data,
            withdraw_public_key: op[i].withdraw_public_key,
            withdraw_address: op[i].withdraw_address
          }]);
          break;

        case 'sidechain_address_update': {
          let operation = {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            payer: op[i].payer,
            sidechain_address_id: op[i].sidechain_address_id,
            sidechain_address_account: op[i].sidechain_address_account,
            sidechain: op[i].sidechain
          };

          if(op[i].hasOwnProperty('deposit_public_key')) {
            operation.deposit_public_key = op[i].deposit_public_key;
          }

          if(op[i].hasOwnProperty('deposit_address')) {
            operation.deposit_address = op[i].deposit_address;
          }

          if(op[i].hasOwnProperty('deposit_address_data')) {
            operation.deposit_address_data = op[i].deposit_address_data;
          }

          if(op[i].hasOwnProperty('withdraw_public_key')) {
            operation.withdraw_public_key = op[i].withdraw_public_key;
          }

          if(op[i].hasOwnProperty('withdraw_address')) {
            operation.withdraw_address = op[i].withdraw_address;
          }

          opJson.push(['sidechain_address_update', operation]);
          break;
        }

        case 'sidechain_address_delete':
          opJson.push(['sidechain_address_delete', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            payer: op[i].payer,
            sidechain_address_id: op[i].sidechain_address_id,
            sidechain_address_account: op[i].sidechain_address_account,
            sidechain: op[i].sidechain
          }]);
          break;

        case 'sidechain_transaction_create':
          opJson.push(['sidechain_transaction_create', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            payer: op[i].payer,
            sidechain: op[i].sidechain,
            object_id: op[i].object_id,
            transaction: op[i].transaction,
            signers: op[i].signers
          }]);
          break;
        case 'sidechain_transaction_sign':
          opJson.push(['sidechain_transaction_sign', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            signer: op[i].signer,
            payer: op[i].payer,
            sidechain_transaction_id: op[i].sidechain_transaction_id,
            signature: op[i].signature
          }]);
          break;

        case 'sidechain_transaction_send':
          opJson.push(['sidechain_transaction_send', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            payer: op[i].payer,
            sidechain_transaction_id: op[i].sidechain_transaction_id,
            sidechain_transaction: op[i].sidechain_transaction
          }]);
          break;

        case 'sidechain_transaction_settle':
          opJson.push(['sidechain_transaction_settle', {
            fee: {
              amount: 0,
              asset_id: op[i].fee_asset
            },
            payer: op[i].payer,
            sidechain_transaction_id: op[i].sidechain_transaction_id
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
        case 'nft_lottery_reward':
          opJson.push([
            'nft_lottery_reward', {
              fee: {
                amount: 0,
                asset_id: op[i].fee_asset
              },
              lottery_id: op[i].lottery_id,
              winner: op[i].winner,
              amount: op[i].amount,
              win_percentage: op[i].win_percentage,
              is_benefactor_reward: op[i].is_benefactor_reward,
              winner_ticket_id: op[i].winner_ticket_id,
              extensions: null
            }
          ]);
          break;
        case 'nft_lottery_end':
          opJson.push([
            'nft_lottery_end', {
              fee: {
                amount: 0,
                asset_id: op[i].fee_asset
              },
              lottery_id: op[i].lottery_id,
              extensions: null
            }
          ]);
          break;
        case 'random_number_store':
          opJson.push([
            'random_number_store', {
              fee: {
                amount: 0,
                asset_id: op[i].fee_asset
              },
              account: op[i].account,
              random_number: op[i].random_number,
              data: op[i].data,
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