const logger = require('log4js').getLogger('peerplays.repository');
const {PrivateKey, Login, TransactionBuilder} = require('peerplaysjs-lib');
const BigNumber = require('bignumber.js');
BigNumber.config({ROUNDING_MODE: BigNumber.ROUND_FLOOR});
const RestError = require('../errors/rest.error');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

class PeerplaysRepository {

  /**
   * @param {PeerplaysConnection} opts.peerplaysConnection
   * @param {AppConfig} opts.config
   */
  constructor(opts) {
    this.peerplaysConnection = opts.peerplaysConnection;
    this.config = opts.config;

    this.pKey = PrivateKey.fromWif(this.config.peerplays.paymentAccountWIF);
  }

  async createPeerplaysAccount(name, ownerKey, activeKey) {
    try {
      const {account} = await this.peerplaysConnection.request({
        account: {
          name,
          active_key: activeKey,
          memo_key: activeKey,
          owner_key: ownerKey,
          refcode: '',
          referrer: this.config.peerplays.referrer
        }
      });

      return {name, ...account};
    } catch (err) {
      throw err;
    }
  }

  async getAccountId(name) {
    let account;

    try {
      account = await this.peerplaysConnection.dbAPI.exec('get_account_by_name', [name]);
    } catch (e) {
      logger.warn('Peerplays returns error', e.message);
      throw new Error('Fetch account error');
    }

    if(account) {
      return account.id;
    } else {
      return null;
    }
  }

  async getBlockchainData(query) {
    let res = null;
    let api = null;
    let params = [];

    switch(query.api) {
      case 'database':
        api = this.peerplaysConnection.dbAPI;
        break;
      case 'network_broadcast':
        api = this.peerplaysConnection.networkAPI;
        break;
      case 'history':
        api = this.peerplaysConnection.historyAPI;
        break;
      case 'crypto':
        api = this.peerplaysConnection.cryptoAPI;
        break;
      case 'bookie':
        api = this.peerplaysConnection.bookieAPI;
        break;
      default:
        api = this.peerplaysConnection.dbAPI;
    }

    if(query.params) {
      params = query.params;
    }

    try {
      res = await api.exec(query.method, params);
    } catch (e) {
      logger.warn('Peerplays returns error', e.message);
      throw new RestError(e.message, 500);
    }

    return res;
  }

  async broadcastSerializedTx(tr) {
    return new Promise((success, fail) => {
      this.peerplaysConnection.networkAPI
        .exec('broadcast_transaction_with_callback', [(res) => success(res), tr])
        .catch((error) => fail(error));
    });
  }

  async getPeerplaysUser(login, password) {
    let keys, publicKey, isWIF = false;

    try {
      keys = PrivateKey.fromWif(password);
      publicKey = keys.toPublicKey().toPublicKeyString();
      isWIF = true;
    } catch(err) {
      isWIF = false;
    }

    if(!isWIF) {
      keys = Login.generateKeys(login, password,
        ['active'],
        IS_PRODUCTION ? 'LLC' : 'TEST');
      publicKey = keys.pubKeys.active;
    }

    const fullAccounts = await this.peerplaysConnection.dbAPI.exec('get_full_accounts',[[login],false]);

    if (fullAccounts) {
      return fullAccounts.find((fullAccount) => {
        return fullAccount[1].account.active.key_auths.find((key_auth)=> {
          return key_auth[0] === publicKey;
        });
      });
    }

    return null;
  }

  async isTransactionConfirmed(transactionNum, blockNum, peerplaysFromId, peerplaysToId, ppyAmount) {
    let lastIrrverisbleBlock;

    try{
      lastIrrverisbleBlock = await this.peerplaysConnection.getLastIrreversibleBlock();
    }catch(err) {
      console.error(err);
      return false;
    }

    if(blockNum > lastIrrverisbleBlock) {
      return false;
    }

    let transaction;

    try {
      transaction = await this.peerplaysConnection.dbAPI.exec('get_transaction',[blockNum, transactionNum]);
    }catch(err) {
      console.error(err);
      return false;
    }

    const operation = transaction.operations[0];

    return operation[0] === 0 &&
      operation[1].from === peerplaysFromId &&
      operation[1].to === peerplaysToId &&
      new BigNumber(operation[1].amount.amount)
        .shiftedBy(-1 * this.peerplaysConnection.asset.precision).integerValue().toNumber().toFixed(2) === ppyAmount.toFixed(2);
  }

  async createAndSendTransaction(opName, opJson, peerplaysAccountName, peerplaysPassword) {
    const tr = new TransactionBuilder();
    let result, keys, activePrivateKey, activePublicKey, isWIF= false;

    try {
      activePrivateKey = PrivateKey.fromWif(peerplaysPassword);
      activePublicKey = activePrivateKey.toPublicKey().toPublicKeyString();
      isWIF = true;
    } catch(err) {
      isWIF = false;
    }

    if(!isWIF) {
      keys = Login.generateKeys(peerplaysAccountName, peerplaysPassword,
        ['active'],
        IS_PRODUCTION ? 'LLC' : 'TEST');
      activePrivateKey = keys.privKeys.active;
      activePublicKey = keys.pubKeys.active;
    }

    try {
      tr.add_type_operation(opName, opJson);

      await tr.set_required_fees();
      tr.add_signer(activePrivateKey, activePublicKey);
      console.trace('serialized transaction:', JSON.stringify(tr.serialize()));
      [result] = await tr.broadcast();
    } catch (e) {
      console.error(e.message);
      throw new RestError(e.message, 500);
    }

    return result;
  }

  async createSendTransaction(opName, opJson) {
    const tr = new TransactionBuilder();
    let result;

    try {
      tr.add_type_operation(opName, opJson);

      await tr.set_required_fees();
      tr.add_signer(this.pKey, this.pKey.toPublicKey().toPublicKeyString());
      console.trace('serialized transaction:', JSON.stringify(tr.serialize()));
      [result] = await tr.broadcast();
    } catch (e) {
      console.error(e.message);
      throw new RestError(e.message, 500);
    }

    return result;
  }

  async createAndSendMultipleOperations(ops, peerplaysAccountName, peerplaysPassword) {
    const tr = new TransactionBuilder();
    let result, keys, activePrivateKey, activePublicKey, isWIF= false;

    if(peerplaysAccountName && peerplaysPassword) {
      try {
        activePrivateKey = PrivateKey.fromWif(peerplaysPassword);
        activePublicKey = activePrivateKey.toPublicKey().toPublicKeyString();
        isWIF = true;
      } catch(err) {
        isWIF = false;
      }

      if(!isWIF) {
        keys = Login.generateKeys(peerplaysAccountName, peerplaysPassword,
          ['active'],
          IS_PRODUCTION ? 'LLC' : 'TEST');
        activePrivateKey = keys.privKeys.active;
        activePublicKey = keys.pubKeys.active;
      }
    } else {
      activePrivateKey = this.pKey;
      activePublicKey = this.pKey.toPublicKey().toPublicKeyString();
    }

    try {
      for(let i = 0; i < ops.length; i++) {
        tr.add_type_operation(ops[i][0], ops[i][1]);
      }

      await tr.set_required_fees();
      tr.add_signer(activePrivateKey, activePublicKey);
      console.trace('serialized transaction:', JSON.stringify(tr.serialize()));
      [result] = await tr.broadcast();
    } catch (e) {
      console.error(e.message);
      throw new RestError(e.message, 500);
    }

    return result;
  }

  async createTransactionFromOps(opJson) {
    const tr = new TransactionBuilder();
    let result;

    try {
      for(let i = 0; i < opJson.length; i++) {
        console.log('Adding ' + JSON.stringify(opJson[i]));
        tr.add_type_operation(opJson[i][0],opJson[i][1]);
      }

      await tr.set_required_fees();
      tr.add_signer(this.pKey, this.pKey.toPublicKey().toPublicKeyString());
      console.trace('serialized transaction:', JSON.stringify(tr.serialize()));
      [result] = await tr.broadcast();
    } catch (e) {
      console.error(e.message);
      throw new RestError(e.message, 500);
    }

    return result;
  }
}

module.exports = PeerplaysRepository;
