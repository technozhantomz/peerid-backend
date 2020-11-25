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
              progressive_jackpots: op[i].lottery_options.progressive_jackpots,
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
              offer_expiration_date: op[i].offer_expiration_date.getTime() / 1000,
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
      }
    }
    return opJson;
  }
}

module.exports = OperationUtil;