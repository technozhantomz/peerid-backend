const logger = require('log4js').getLogger('peerplays.repository');
const {PrivateKey, Login, TransactionBuilder} = require('peerplaysjs-lib');
const BigNumber = require('bignumber.js');
BigNumber.config({ROUNDING_MODE: BigNumber.ROUND_FLOOR});

const PeerplaysNameExistsError = require('./../errors/peerplays-name-exists.error');

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
      if (err.base && err.base[0]) {
        if (err.base[0] === 'Account exists') {
          throw new PeerplaysNameExistsError(`an account with name "${name}" already exists`);
        }
      }

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

  async broadcastSerializedTx(tr) {
    return new Promise((success, fail) => {
      this.peerplaysConnection.networkAPI
        .exec('broadcast_transaction_with_callback', [(res) => success(res), tr])
        .catch((error) => fail(error));
    });
  }

  async getPeerplaysUser(login, password) {
    const keys = Login.generateKeys(login, password,
      ['active'],
      IS_PRODUCTION ? 'PPY' : 'TEST');
    const publicKey = keys.pubKeys.active;
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
    let result;

    const keys = Login.generateKeys(peerplaysAccountName, peerplaysPassword,
      ['active'],
      IS_PRODUCTION ? 'PPY' : 'TEST');

    try {
      tr.add_type_operation(opName, opJson);

      await tr.set_required_fees();
      tr.add_signer(keys.privKeys.active, keys.pubKeys.active);
      console.trace('serialized transaction:', JSON.stringify(tr.serialize()));
      [result] = await tr.broadcast();
    } catch (e) {
      console.error(e.message);
      throw e;
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
      throw e;
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
      throw e;
    }

    return result;
  }
}

module.exports = PeerplaysRepository;
