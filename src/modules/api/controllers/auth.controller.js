const ValidateError = require('../../../errors/validate.error');
const RestError = require('../../../errors/rest.error');

/**
 * @swagger
 *
 * definitions:
 *  AuthSignUpUser:
 *    type: object
 *    required:
 *      - email
 *    properties:
 *      email:
 *        type: string
 *        format: email
 *      username:
 *        type: string
 *      password:
 *        type: string
 *        format: password
 *      mobile:
 *        type: string
 *        example: 999-999-9999
 *  AuthSignInUser:
 *    type: object
 *    required:
 *      - login
 *    properties:
 *      login:
 *        type: string
 *      password:
 *        type: string
 *        format: password
 *      mobile:
 *        type: string
 *        example: 999-999-9999
 *  AuthForgotPassword:
 *    type: object
 *    required:
 *      - email
 *    properties:
 *      email:
 *        type: string
 *        format: email
 *  AuthResetPassword:
 *    type: object
 *    required:
 *      - token
 *      - password
 *    properties:
 *      token:
 *        type: string
 *      password:
 *        type: string
 *        format: password
 *  UserResponse:
 *    allOf:
 *      - $ref: '#/definitions/SuccessResponse'
 *      - type: object
 *        properties:
 *          result:
 *            $ref: '#/definitions/User'
 *  UsersResponse:
 *    allOf:
 *      - $ref: '#/definitions/SuccessResponse'
 *      - type: object
 *        properties:
 *          result:
 *            type: array
 *            items:
 *              $ref: '#/definitions/User'
 *  ExchangeCode:
 *    type: object
 *    required:
 *      - code
 *      - client_id
 *      - client_secret
 *    properties:
 *      code:
 *        type: string
 *        format: uuid
 *        example: 2kj2un2u-22nnj-m2n2n-6edu3he
 *      client_id:
 *        type: integer
 *        example: 20
 *      client_secret:
 *        type: string
 *        example: asdf0l0aksf97ja93yh
 *  RefreshTokenRequest:
 *    type: object
 *    required:
 *      - refresh_token
 *      - client_id
 *      - client_secret
 *    properties:
 *      refresh_token:
 *        type: string
 *        format: uuid
 *        example: 2kj2un2u-22nnj-m2n2n-6edu3he
 *      client_id:
 *        type: integer
 *        example: 20
 *      client_secret:
 *        type: string
 *        example: asdf0l0aksf97ja93yh
 */

class AuthController {

  /**
   * @param {AuthValidator} opts.authValidator
   * @param {UserService} opts.userService
   * @param {AppService} opts.appService
   */
  constructor(opts) {
    this.authValidator = opts.authValidator;
    this.userService = opts.userService;
    this.appService = opts.appService;
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
       * /auth/logout:
       *  post:
       *    description: Logout
       *    produces:
       *      - application/json
       *    tags:
       *      - Auth
       *    responses:
       *      200:
       *        description: Logout response
       *        schema:
       *          $ref: '#/definitions/SuccessEmptyResponse'
       *      400:
       *        description: Error form validation
       *        schema:
       *          $ref: '#/definitions/ValidateError'
       *      401:
       *        description: Error user unauthorized
       *        schema:
       *          $ref: '#/definitions/UnauthorizedError'
       *
       */
      ['post', '/api/v1/auth/logout', this.authValidator.loggedOnly, this.logout.bind(this)],
      /**
       * @swagger
       *
       * /auth/sign-up:
       *  post:
       *    description: Sign up
       *    produces:
       *      - application/json
       *    tags:
       *      - Auth
       *    parameters:
       *      - name: user
       *        description: User object
       *        in:  body
       *        required: true
       *        schema:
       *          $ref: '#/definitions/AuthSignUpUser'
       *    responses:
       *      200:
       *        description: User response
       *        schema:
       *          $ref: '#/definitions/UserResponse'
       *      400:
       *        description: Error form validation
       *        schema:
       *          $ref: '#/definitions/ValidateError'
       */
      ['post', '/api/v1/auth/sign-up', this.authValidator.validateSignUp, this.signUp.bind(this)],
      /**
       * @swagger
       *
       * /auth/confirm-email/{token}:
       *  get:
       *    description: Confirm email
       *    produces:
       *      - application/json
       *    tags:
       *      - Auth
       *    parameters:
       *      - name: token
       *        in:  path
       *        required: true
       *        type: string
       *    responses:
       *      200:
       *        description: Confirm-email response
       *        schema:
       *         $ref: '#/definitions/UserResponse'
       *      400:
       *        description: Error form validation
       *        schema:
       *          $ref: '#/definitions/ValidateError'
       */
      [
        'get',
        '/api/v1/auth/confirm-email/:token',
        this.authValidator.validateConfirmEmail,
        this.confirmEmail.bind(this)
      ],
      /**
       * @swagger
       *
       * /auth/sign-in:
       *  post:
       *    description: Sign in
       *    produces:
       *      - application/json
       *    tags:
       *      - Auth
       *    parameters:
       *      - name: token
       *        in:  body
       *        required: true
       *        schema:
       *          $ref: '#/definitions/AuthSignInUser'
       *    responses:
       *      200:
       *        description: Sign in response
       *        schema:
       *          $ref: '#/definitions/UserResponse'
       *      400:
       *        description: Error form validation
       *        schema:
       *          $ref: '#/definitions/ValidateError'
       */
      ['post', '/api/v1/auth/sign-in', this.authValidator.validateSignIn, this.signIn.bind(this)],
      /**
       * @swagger
       *
       * /auth/forgot-password:
       *  post:
       *    description: Forgot password
       *    produces:
       *      - application/json
       *    tags:
       *      - Auth
       *    parameters:
       *      - name: token
       *        in: body
       *        required: true
       *        schema:
       *          $ref: '#/definitions/AuthForgotPassword'
       *    responses:
       *      200:
       *        description: Forgot-password response
       *        schema:
       *         $ref: '#/definitions/SuccessEmptyResponse'
       *      400:
       *        description: Error form validation
       *        schema:
       *          $ref: '#/definitions/ValidateError'
       *      404:
       *        description: Error user not found
       *        schema:
       *          properties:
       *            status:
       *              type: number
       *              example: 404
       *            error:
       *              type: string
       *              example: User not found
       *      429:
       *        description: Error too many requests
       *        schema:
       *          properties:
       *            status:
       *              type: number
       *              example: 429
       *            error:
       *              type: string
       *              example: Too many requests
       */
      [
        'post',
        '/api/v1/auth/forgot-password',
        this.authValidator.validateForgotPassword,
        this.forgotPassword.bind(this)
      ],
      /**
       * @swagger
       *
       * /auth/reset-password:
       *  post:
       *    description: Reset password
       *    produces:
       *      - application/json
       *    tags:
       *      - Auth
       *    parameters:
       *      - name: token
       *        in: body
       *        required: true
       *        schema:
       *          $ref: '#/definitions/AuthResetPassword'
       *    responses:
       *      200:
       *        description: Reset-password response
       *        schema:
       *         $ref: '#/definitions/UserResponse'
       *      400:
       *        description: Error form validation
       *        schema:
       *          $ref: '#/definitions/ValidateError'
       *      404:
       *        description: Error token not found
       *        schema:
       *          properties:
       *            status:
       *              type: number
       *              example: 404
       *            error:
       *              type: string
       *              example: Token not found
       */
      [
        'post',
        '/api/v1/auth/reset-password',
        this.authValidator.validateResetPassword,
        this.resetPassword.bind(this)
      ],
      /**
       * @swagger
       *
       * /auth/peerplays:
       *  post:
       *    description: Login with Peerplays
       *    produces:
       *      - application/json
       *    tags:
       *      - Auth
       *    parameters:
       *      - name: peerplays
       *        in: body
       *        required: true
       *        schema:
       *          $ref: '#/definitions/AuthSignInUser'
       *    responses:
       *      200:
       *        description: Login response
       *        schema:
       *         $ref: '#/definitions/UserResponse'
       *      400:
       *        description: Error form validation
       *        schema:
       *          $ref: '#/definitions/ValidateError'
       */
      [
        'post',
        '/api/v1/auth/peerplays',
        this.authValidator.validatePeerplaysLogin,
        this.peerplaysLogin.bind(this)
      ],
      /**
       * @swagger
       *
       * /auth/exchange:
       *  post:
       *    description: Exchange grant code with access token
       *    produces:
       *      - application/json
       *    tags:
       *      - Auth
       *    parameters:
       *      - name: code
       *        in: body
       *        required: true
       *        schema:
       *          $ref: '#/definitions/ExchangeCode'
       *    responses:
       *      200:
       *        description: Access Token response
       *        schema:
       *         $ref: '#/definitions/AccessToken'
       *      400:
       *        description: Error form validation
       *        schema:
       *          $ref: '#/definitions/ValidateError'
       */
      [
        'post',
        '/api/v1/auth/exchange',
        this.authValidator.validateCode,
        this.exchangeCode.bind(this)
      ],
      /**
       * @swagger
       *
       * /auth/refreshtoken:
       *  post:
       *    description: Refresh the access token if its expired
       *    produces:
       *      - application/json
       *    tags:
       *      - Auth
       *    parameters:
       *      - name: refreshtoken
       *        in:  body
       *        required: true
       *        schema:
       *          $ref: '#/definitions/RefreshTokenRequest'
       *    responses:
       *      200:
       *        description: Refresh Token response
       *        schema:
       *         $ref: '#/definitions/AccessToken'
       *      400:
       *        description: Error form validation
       *        schema:
       *          $ref: '#/definitions/ValidateError'
       */
      [
        'post',
        '/api/v1/auth/refreshtoken',
        this.authValidator.validateRefreshToken,
        this.refreshToken.bind(this)
      ]
    ];
  }

  async logout(user, data, req) {
    req.logout();
    return true;
  }

  async signUp(user, {email, mobile, password, username}) {
    return this.userService.signUpWithPassword(email.toLowerCase(), username, password, mobile);
  }

  async confirmEmail(user, ActiveToken, req) {
    if (user && user.id !== ActiveToken.userId) {
      throw new ValidateError(401, 'unauthorized');
    }

    const res = await this.userService.confirmEmail(ActiveToken);

    await new Promise((success) => req.login(res, () => success()));
    return res;
  }

  async signIn(_, {login, password, mobile}, req) {
    let user;

    try {
      user = await this.userService.getSignInUser(login, password, mobile);
    } catch (e) {
      throw new ValidateError(400, 'Validate error', {
        email: 'Invalid email/username or password'
      });
    }

    await new Promise((success) => req.login(user, () => success()));
    return user;
  }

  async forgotPassword(_, email) {
    try {
      await this.userService.sendResetPasswordEmail(email.toLowerCase());
    } catch (e) {
      switch (e.message) {
        case this.userService.errors.USER_NOT_FOUND:
          throw new RestError('User not found', 404);
        case this.userService.errors.TOO_MANY_REQUESTS:
          throw new RestError('Too many requests', 429);
        default:
          throw new RestError('Server side error', 500);
      }
    }

    return true;
  }

  async resetPassword(_, {ResetToken, password}, req) {

    if (_ && _.id !== ResetToken.userId) {
      throw new ValidateError(401, 'unauthorized');
    }

    const user = await this.userService.resetPassword(ResetToken.user, password);
    await ResetToken.deactivate();
    
    await new Promise((success) => req.login(user, () => success()));
    return user;
  }

  async peerplaysLogin(_, {login, password}, req) {
    const user = await this.userService.loginPeerplaysUser(login, password, req.user);
    await new Promise((success) => req.login(user, () => success()));
    return user;
  }

  async exchangeCode(user, {grantCode, appId, scope}) {
    return await this.appService.createAccessToken(grantCode, appId, scope);
  }

  async refreshToken(user, {app_id, AccessToken}) {
    return await this.appService.refreshAccessToken(user, app_id, AccessToken);
  }
}

module.exports = AuthController;
