/**
 * @swagger
 *
 * definitions:
 *  NewApp:
 *   allOf:
 *    - $ref: '#/definitions/App'
 *    - type: object
 *      properties:
 *        operations:
 *          type: array
 *          items:
 *            type: integer
 *  JoinAppRequest:
 *    type: object
 *    required:
 *      - client_id
 *      - redirect_uri
 *    properties:
 *      client_id:
 *        type: integer
 *        example: 4
 *      redirect_uri:
 *        type: string
 *        format: uri
 *        example: https://www.abc.com/auth
 *  UnjoinAppRequest:
 *    type: object
 *    required:
 *      - app_id
 *    properties:
 *      app_id:
 *        type: integer
 *        example: 4
 *  AppResponse:
 *    allOf:
 *      - $ref: '#/definitions/SuccessResponse'
 *      - type: object
 *        properties:
 *          result:
 *            $ref: '#/definitions/App'
 *  AppsResponse:
 *    allOf:
 *      - $ref: '#/definitions/SuccessResponse'
 *      - type: object
 *        properties:
 *          result:
 *            $ref: '#/definitions/Apps'
 *  GrantCodeResponse:
 *    allOf:
 *      - $ref: '#/definitions/SuccessResponse'
 *      - type: object
 *        properties:
 *          result:
 *            type: string
 *  AppOperationsResponse:
 *    allOf:
 *      - $ref: '#/definitions/SuccessResponse'
 *      - type: object
 *        properties:
 *          result:
 *            $ref: '#/definitions/NewApp'
 *  BlockchainDataRequest:
 *    type: object
 *    required:
 *      - api
 *      - method
 *    properties:
 *      api:
 *        type: string
 *        enum:
 *          - database
 *          - network_broadcast
 *          - history
 *          - crypto
 *          - bookie
 *      method:
 *        type: string
 *      params:
 *        type: array
 *        items: {}
 *  BlockchainDataResponse:
 *    allOf:
 *      - $ref: '#/definitions/SuccessResponse'
 *      - type: object
 *        properties:
 *          result:
 *            type: object
 */
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
      /**
       * @swagger
       *
       * /app:
       *  post:
       *    description: Create or edit an app
       *    produces:
       *      - application/json
       *    tags:
       *      - App
       *    parameters:
       *      - name: app
       *        in: body
       *        required: true
       *        schema:
       *          $ref: '#/definitions/NewApp'
       *    responses:
       *      200:
       *        description: App create response
       *        schema:
       *         $ref: '#/definitions/AppResponse'
       *      400:
       *        description: Error form validation
       *        schema:
       *          $ref: '#/definitions/ValidateError'
       */
      [
        'post',
        '/api/v1/app',
        this.authValidator.loggedOnly,
        this.appValidator.registerApp,
        this.registerApp.bind(this)
      ],
      /**
       * @swagger
       *
       * /apps:
       *  get:
       *    description: Get apps created by user
       *    produces:
       *      - application/json
       *    tags:
       *      - App
       *    responses:
       *      200:
       *        description: App create response
       *        schema:
       *         $ref: '#/definitions/AppsResponse'
       */
      [
        'get',
        '/api/v1/apps',
        this.authValidator.loggedOnly,
        this.getAppsForUser.bind(this)
      ],
      /**
       * @swagger
       *
       * /app:
       *  delete:
       *    description: Delete an app created by user
       *    produces:
       *      - application/json
       *    parameters:
       *      - name: token
       *        in: query
       *        required: true
       *        description: token received in email to confirm app deletion
       *        type: string
       *    tags:
       *      - App
       *    responses:
       *      200:
       *        description: App delete response
       *        schema:
       *         $ref: '#/definitions/SuccessResponse'
       *      400:
       *        description: Error in id validation
       *        schema:
       *          $ref: '#/definitions/ValidateError'
       */
      [
        'delete',
        '/api/v1/app',
        this.appValidator.deleteApp,
        this.deleteApp.bind(this)
      ],
      /**
       * @swagger
       *
       * /app/secret:
       *  get:
       *    description: Get app secret
       *    produces:
       *      - application/json
       *    parameters:
       *      - name: id
       *        in: query
       *        required: true
       *        description: id of the app
       *        type: integer
       *    tags:
       *      - App
       *    responses:
       *      200:
       *        description: App response with app_secret
       *        schema:
       *         $ref: '#/definitions/AppResponse'
       *      400:
       *        description: Error in id validation
       *        schema:
       *          $ref: '#/definitions/ValidateError'
       */
      [
        'get',
        '/api/v1/app/secret',
        this.authValidator.loggedOnly,
        this.appValidator.validateAppId,
        this.getAppSecret.bind(this)
      ],
      [
        'post',
        '/api/v1/app/broadcast',
        this.authValidator.validateAccessToken,
        this.appValidator.validateTransaction,
        this.broadcastTransaction.bind(this)
      ],
      /**
       * @swagger
       *
       * /app/operations:
       *  post:
       *    description: Create and broadcast an operation
       *    produces:
       *      - application/json
       *    parameters:
       *      - in: header
       *        name: Authorization
       *        schema:
       *          type: string
       *          format: uuid
       *        required: true
       *      - in: header
       *        name: ClientID
       *        schema:
       *          type: integer
       *        required: true
       *      - in: body
       *        required: true
       *        schema:
       *          $ref: '#/definitions/OperationsRequest'
       *    tags:
       *      - App
       *      - Operations
       *    responses:
       *      200:
       *        description: Transaction result response
       *        schema:
       *         $ref: '#/definitions/TransactionResponse'
       *      400:
       *        description: Error in operation validation
       *        schema:
       *          $ref: '#/definitions/ValidateError'
       */
      [
        'post',
        '/api/v1/app/operations',
        this.authValidator.validateAccessToken,
        this.appValidator.validateOperations,
        this.broadcastOperations.bind(this)
      ],
      /**
       * @swagger
       *
       * /app/transaction-token:
       *  post:
       *    description: Confirm the transaction
       *    produces:
       *      - application/json
       *    parameters:
       *      - in: header
       *        name: Authorization
       *        schema:
       *          type: string
       *          format: uuid
       *        required: true
       *      - in: header
       *        name: ClientID
       *        schema:
       *          type: integer
       *        required: true
       *      - name: token
       *        in: query
       *        required: true
       *        type: string
       *    tags:
       *      - App
       *      - Operations
       *    responses:
       *      200:
       *        description: Transaction result response
       *        schema:
       *         $ref: '#/definitions/TransactionResponse'
       *      400:
       *        description: Error in token validation
       *        schema:
       *          $ref: '#/definitions/ValidateError'
       */
      [
        'post',
        '/api/v1/app/transaction-token',
        this.authValidator.validateAccessToken,
        this.appValidator.validateTransactionToken,
        this.confirmTransaction.bind(this)
      ],
      /**
       * @swagger
       *
       * /app/join:
       *  post:
       *    description: Join an app
       *    produces:
       *      - application/json
       *    parameters:
       *      - name: app
       *        in: body
       *        required: true
       *        schema:
       *          $ref: '#/definitions/JoinAppRequest'
       *    tags:
       *      - App
       *    responses:
       *      200:
       *        description: Grant code response
       *        schema:
       *         $ref: '#/definitions/GrantCodeResponse'
       *      400:
       *        description: Error in id validation
       *        schema:
       *          $ref: '#/definitions/ValidateError'
       */
      [
        'post',
        '/api/v1/app/join',
        this.authValidator.loggedOnly,
        this.appValidator.joinApp,
        this.joinApp.bind(this)
      ],
      /**
       * @swagger
       *
       * /app:
       *  get:
       *    description: Get app with operations
       *    produces:
       *      - application/json
       *    parameters:
       *      - name: id
       *        in: query
       *        required: true
       *        description: id of the app
       *        type: integer
       *    tags:
       *      - App
       *    responses:
       *      200:
       *        description: App response with operations
       *        schema:
       *         $ref: '#/definitions/AppOperationsResponse'
       *      400:
       *        description: Error in id validation
       *        schema:
       *          $ref: '#/definitions/ValidateError'
       */
      [
        'get',
        '/api/v1/app',
        this.authValidator.loggedOnly,
        this.appValidator.getAppOperations,
        this.getAppOperations.bind(this)
      ],
      /**
       * @swagger
       *
       * /apps/permitted:
       *  get:
       *    description: Get apps permitted by user
       *    produces:
       *      - application/json
       *    tags:
       *      - App
       *    responses:
       *      200:
       *        description: App response with operations
       *        schema:
       *         $ref: '#/definitions/AppOperationsResponse'
       *      400:
       *        description: Error in id validation
       *        schema:
       *          $ref: '#/definitions/ValidateError'
       */
      [
        'get',
        '/api/v1/apps/permitted',
        this.authValidator.loggedOnly,
        this.getPermittedApps.bind(this)
      ],
      /**
       * @swagger
       *
       * /app/unjoin:
       *  post:
       *    description: Revoke app permissions
       *    produces:
       *      - application/json
       *    parameters:
       *      - name: app
       *        in: body
       *        required: true
       *        schema:
       *          $ref: '#/definitions/UnjoinAppRequest'
       *    tags:
       *      - App
       *    responses:
       *      200:
       *        description: Success response
       *        schema:
       *         $ref: '#/definitions/SuccessResponse'
       *      400:
       *        description: Error in id validation
       *        schema:
       *          $ref: '#/definitions/ValidateError'
       */
      [
        'post',
        '/api/v1/app/unjoin',
        this.authValidator.loggedOnly,
        this.appValidator.unjoinApp,
        this.unjoinApp.bind(this)
      ],
      /**
       * @swagger
       *
       * /app/delete:
       *  post:
       *    description: Send confirmation email for app delete
       *    produces:
       *      - application/json
       *    parameters:
       *      - in: body
       *        required: true
       *        schema:
       *          $ref: '#/definitions/UnjoinAppRequest'
       *    tags:
       *      - App
       *    responses:
       *      200:
       *        description: Send delete app email response
       *        schema:
       *         $ref: '#/definitions/SuccessResponse'
       *      400:
       *        description: Error in id validation
       *        schema:
       *          $ref: '#/definitions/ValidateError'
       */
      [
        'post',
        '/api/v1/app/delete',
        this.authValidator.loggedOnly,
        this.appValidator.sendDeleteAppEmail,
        this.sendDeleteEmail.bind(this)
      ],
      /**
       * @swagger
       *
       * /app/blockchain-data:
       *  get:
       *    description: Get blockchain data
       *    produces:
       *      - application/json
       *    parameters:
       *      - in: query
       *        required: true
       *        schema:
       *          $ref: '#/definitions/BlockchainDataRequest'
       *    tags:
       *      - App
       *    responses:
       *      200:
       *        description: Success response
       *        schema:
       *         $ref: '#/definitions/BlockchainDataResponse'
       *      400:
       *        description: Error in request validation
       *        schema:
       *          $ref: '#/definitions/ValidateError'
       */
      [
        'get',
        '/api/v1/app/blockchain-data',
        this.appValidator.validateBlockchainData,
        this.getBlockchainData.bind(this)
      ]
    ];
  }

  async registerApp(user, data) {
    return await this.appService.registerApp(data, user.id);
  }

  async getAppsForUser(user) {
    return await this.appService.getApps(user.id);
  }

  async deleteApp(user, token) {
    return await this.appService.deleteApp(token);
  }

  getAppSecret(user, app) {
    return app.app_secret;
  }

  async broadcastTransaction(user, transaction) {
    return await this.appService.broadcastTransaction(transaction);
  }

  async joinApp(user, app) {
    return await this.appService.joinApp(user, app);
  }

  async getAppOperations(user, app_id) {
    return await this.appService.getOperationsForApp(app_id);
  }

  async getPermittedApps(user) {
    return await this.appService.getPermittedApps(user);
  }

  async unjoinApp(user, app ) {
    return await this.appService.unjoinApp(user, app);
  }

  async broadcastOperations(user, {op, app_id}) {
    return await this.appService.broadcastOperations(op, app_id, user.id);
  }

  async confirmTransaction(user, token) {
    return await this.appService.confirmTransaction(token);
  }

  async getBlockchainData(user, query) {
    return await this.appService.getBlockchainData(query);
  }

  async sendDeleteEmail(user, app) {
    return await this.appService.sendDeleteConfirmation(user, app);
  }
}

module.exports = AppController;
