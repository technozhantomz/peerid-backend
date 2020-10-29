const RestError = require('../../../errors/rest.error');
const ValidateError = require('./../../../errors/validate.error');

/**
 * @swagger
 *
 * definitions:
 *  ProfileCreatePeerplaysAccount:
 *    type: object
 *    required:
 *      - name
 *      - activeKey
 *      - ownerKey
 *    properties:
 *      name:
 *        type: string
 *      activeKey:
 *        type: string
 *      ownerKey:
 *        type: string
 *  ProfileResponse:
 *    allOf:
 *      - $ref: '#/definitions/SuccessResponse'
 *      - type: object
 *        properties:
 *          result:
 *            $ref: '#/definitions/User'
 */

class ProfileController {

  /**
   * @param {AuthValidator} opts.authValidator
   * @param {ProfileValidator} opts.profileValidator
   * @param {UserService} opts.userService
   */
  constructor(opts) {
    this.authValidator = opts.authValidator;
    this.profileValidator = opts.profileValidator;
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
       * /profile:
       *  get:
       *    description: Get authorized user profile
       *    summary: Get authorized user profile
       *    produces:
       *      - application/json
       *    tags:
       *      - Profile
       *    responses:
       *      200:
       *        description: Profile response
       *        schema:
       *         $ref: '#/definitions/UserResponse'
       *      401:
       *        description: Error user unauthorized
       *        schema:
       *          $ref: '#/definitions/UnauthorizedError'
       */
      [
        'get', '/api/v1/profile',
        this.authValidator.loggedOnly,
        this.getProfile.bind(this)
      ],
      /**
       * @swagger
       *
       * /profile/peerplays/create-account:
       *  post:
       *    description: Create peerplays account for authorized user
       *    summary: Create peerplays account for authorized user
       *    produces:
       *      - application/json
       *    tags:
       *      - Profile
       *    parameters:
       *      - name: ProfileCreatePeerplaysAccount
       *        in:  body
       *        required: true
       *        schema:
       *          $ref: '#/definitions/ProfileCreatePeerplaysAccount'
       *    responses:
       *      200:
       *        description: Create-account response
       *        schema:
       *          $ref: '#/definitions/ProfileResponse'
       *      401:
       *        description: Error user unauthorized
       *        schema:
       *          $ref: '#/definitions/UnauthorizedError'
       *      400:
       *        description: Error form validation
       *        schema:
       *          $ref: '#/definitions/ValidateError'
       */
      [
        'post', '/api/v1/profile/peerplays/create-account',
        this.authValidator.loggedOnly,
        this.profileValidator.createPeerplaysAccount,
        this.createPeerplaysAccount.bind(this)
      ],
      /**
       * @swagger
       *
       * /profile/change-email/{token}:
       *  get:
       *    description: Change user email
       *    summary: Change user email
       *    produces:
       *      - application/json
       *    tags:
       *      - Profile
       *    parameters:
       *      - name: token
       *        in:  path
       *        required: true
       *        type: string
       *    responses:
       *      200:
       *        description: Change user email response
       *        schema:
       *          $ref: '#/definitions/ProfileResponse'
       *      401:
       *        description: Error user unauthorized
       *        schema:
       *          $ref: '#/definitions/UnauthorizedError'
       */
      [
        'get', '/api/v1/profile/change-email/:token',
        this.authValidator.validateConfirmEmail,
        this.changeEmail.bind(this)
      ]
    ];
  }

  async getProfile(user) {
    return this.userService.getCleanUser(user);
  }

  async createPeerplaysAccount(user, data) {
    try {
      return await this.userService.createPeerplaysAccount(user, data);
    } catch (e) {
      throw new RestError(e.message, 400, e.details);
    }
  }

  handleError(err) {
    if (err.message === this.fileService.errors.INVALID_REQUEST) {
      throw new RestError('', 400, {image: [{message: 'Invalid Request'}]});
    } else if (err.message.toLowerCase().startsWith('invalid url')) {
      throw new RestError('', 400, {format: [{message: 'Invalid URL'}]});
    } else {
      throw err;
    }
  }

  async changeEmail(user, ActiveToken) {
    try {
      if (user && user.id !== ActiveToken.userId) {
        throw new ValidateError(401, 'unauthorized');
      }

      return await this.userService.changeEmail(ActiveToken);
    } catch (err) {
      this.handleError(err);
    }
  }
}

module.exports = ProfileController;
