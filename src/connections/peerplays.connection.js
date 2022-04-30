/* istanbul ignore file */
const axios = require('axios');
const {
  Apis,
  ConnectionManager,
  TransactionBuilder,
  ChainConfig
} = require('peerplaysjs-lib');
const {getLogger} = require('log4js');
const logger = getLogger();
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const BaseConnection = require('./abstracts/base.connection');
const RestError = require('./../errors/rest.error');
const PeerplaysNameExistsError = require('./../errors/peerplays-name-exists.error');

const HEALTHCHECK_INTERVAL = 1000 * 10; //milliseconds
const MAX_RETRY_TIMEOUT = 60; //seconds

function getRetryTimeout(attempt) {
  return Math.min(Math.pow(2.0, attempt + 1.0), MAX_RETRY_TIMEOUT) * 1000.0;
}

class PeerplaysConnection extends BaseConnection {

  /**
   * @param {AppConfig} opts.config
   */
  constructor(opts) {
    super();

    this.config = opts.config;
    this.dbAPI = null;
    this.networkAPI = null;
    this.historyAPI = null;
    this.cryptoAPI = null;
    this.bookieAPI = null;
    this.asset = null;
    this.apiInstance = null;
    this.reconnectAttempt = 0;

    const urls = this.config.peerplays.peerplaysWS.split(',');
    this.wsConnectionManager = new ConnectionManager({urls});
  }
  
  doHealthcheck() {
    this.dbAPI.exec('get_global_properties', [])
      .then(() => {
        setTimeout(() => this.doHealthcheck(), HEALTHCHECK_INTERVAL);
      })
      .catch(() => this.connect());
  }

  async connect() {
    this.endpoints = await this.wsConnectionManager.sortNodesByLatency();

    if (!this.endpoints || this.endpoints.length === 0) {
      const timeout = getRetryTimeout(this.reconnectAttempt++);
      setTimeout(() => this.connect(), timeout);
      throw new Error('no valid peerplays urls');
    }

    const endpoint = this.endpoints[this.reconnectAttempt % this.endpoints.length];
    logger.info(`connecting to peerplays endpoint "${endpoint}"`);
    const apiInstance = Apis.instance(endpoint, true);
    ChainConfig.setPrefix(IS_PRODUCTION ? 'PPY' : 'TEST');

    try {
      await apiInstance.init_promise;
    } catch (err) {
      const timeout = getRetryTimeout(this.reconnectAttempt++);
      logger.info(`peerplays connection failed, reason: ${err.message}, retrying in ${timeout / 1000.0} seconds`);
      setTimeout(() => this.connect(), timeout);
      return;
    }

    this.reconnectAttempt = 0;

    this.apiInstance = apiInstance;
    this.dbAPI = this.apiInstance.db_api();
    this.networkAPI = this.apiInstance.network_api();
    this.historyAPI = this.apiInstance.history_api();
    this.cryptoAPI = this.apiInstance.crypto_api();
    this.bookieAPI = this.apiInstance.bookie_api();
    [this.asset] = await this.dbAPI.exec('get_assets', [['1.3.0']]);
    this.TransactionBuilder = TransactionBuilder;
    
    this.doHealthcheck();
    logger.info('peerplays connection successful');
  }

  request(form) {
    return axios.post(this.config.peerplays.peerplaysFaucetURL, form).then((res) => {
      if (res.status !== 200) {
        throw new Error('Peerplays: Unknown error');
      }

      if(res.data.error) {
        const err = res.data.error;

        if (err.base && err.base[0]) {
          if (err.base[0] === 'Account exists') {
            throw new PeerplaysNameExistsError(`an account with name "${form.name}" already exists`);
          }
        }

        throw new RestError(err, 500);
      }

      return res.data;
    }).catch((err) => {
      if (err instanceof PeerplaysNameExistsError) {
        throw err;
      }

      throw new RestError(err.message, 500);
    });
  }

  async getLastIrreversibleBlock(){
    return this.dbAPI.exec('get_dynamic_global_properties',[]).then((result) => result['last_irreversible_block_num']);
  }

  disconnect() {
  }

}

module.exports = PeerplaysConnection;
