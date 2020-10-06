class AppController {

  /**
   * @param {AuthValidator} opts.authValidator
   * @param {AppService} opts.appService
   * @param {AppValidator} opts.appValidator
   * @param {UserService} opts.userService
   */
  constructor(opts) {
    this.authValidator = opts.authValidator;
    this.appValidator = opts.appValidator;
    this.appService = opts.appService;
    this.userService = opts.userService;
  }

  /**
   * Array of routes processed by this controller
   * @returns {*[]}
   */
  getRoutes() {
    return [
      [
        'post',
        '/api/v1/app',
        this.authValidator.loggedOnly,
        this.appValidator.registerApp,
        this.registerApp.bind(this)
      ],
      [
        'get',
        '/api/v1/apps',
        this.authValidator.loggedOnly,
        this.getAppsForUser.bind(this)
      ],
      [
        'delete',
        '/api/v1/app',
        this.authValidator.loggedOnly,
        this.appValidator.deleteApp,
        this.deleteApp.bind(this)
      ],
      [
        'get',
        '/api/v1/app/secret',
        this.authValidator.loggedOnly,
        this.appValidator.deleteApp,
        this.getAppSecret.bind(this)
      ],
      [
        'post',
        '/api/v1/app/broadcast',
        this.authValidator.validateAccessToken,
        this.appValidator.validateTransaction,
        this.broadcastTransaction.bind(this)
      ],
      [
        'post',
        '/api/v1/app/join',
        this.authValidator.loggedOnly,
        this.appValidator.joinApp,
        this.joinApp.bind(this)
      ],
      [
        'get',
        '/api/v1/app',
        this.authValidator.loggedOnly,
        this.appValidator.getAppOperations,
        this.getAppOperations.bind(this)
      ],
      [
        'get',
        '/api/v1/apps/permitted',
        this.authValidator.loggedOnly,
        this.getPermittedApps.bind(this)
      ],
      [
        'post',
        '/api/v1/app/unjoin',
        this.authValidator.loggedOnly,
        this.appValidator.unjoinApp,
        this.unjoinApp.bind(this)
      ]
    ];
  }

  async registerApp(user, data) {
    return await this.appService.registerApp(data, user.id);
  }

  async getAppsForUser(user) {
    return await this.appService.getApps(user.id);
  }

  async deleteApp(user, app) {
    return await this.appService.deleteApp(app.id);
  }

  getAppSecret(user, app) {
    return app.app_secret;
  }

  async broadcastTransaction(user, transaction) {
    return await this.appService.broadcastTransaction(transaction);
  }

  async joinApp(user, { app, custom_account_auth_trx}) {
    return await this.appService.joinApp(user, app, custom_account_auth_trx);
  }

  async getAppOperations(user, app_id) {
    return await this.appService.getOperationsForApp(app_id);
  }

  async getPermittedApps(user) {
    return await this.appService.getPermittedApps(user);
  }

  async unjoinApp(user, { app, custom_account_auth_trx }) {
    return await this.appService.unjoinApp(user, app, custom_account_auth_trx);
  }
}

module.exports = AppController;
