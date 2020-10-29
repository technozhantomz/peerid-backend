const RestError = require('../../../errors/rest.error');

class UsersController {

  /**
   * @param {AuthValidator} opts.authValidator
   * @param {UserValidator} opts.userValidator
   * @param {UserService} opts.userService
   */
  constructor(opts) {
    this.authValidator = opts.authValidator;
    this.userService = opts.userService;
    this.userValidator = opts.userValidator;
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
       * /users/{id}:
       *  get:
       *    description: Get user by id
       *    produces:
       *      - application/json
       *    tags:
       *      - User
       *    parameters:
       *      - name: id
       *        description: User id
       *        in: path
       *        required: true
       *        type: string
       *    responses:
       *      200:
       *        description: User response
       *        schema:
       *          $ref: '#/definitions/UserResponse'
       *      400:
       *        description: Error form validation
       *        schema:
       *          $ref: '#/definitions/ValidateError'
       *      401:
       *        description: Error user unauthorized
       *        schema:
       *          $ref: '#/definitions/UnauthorizedError'
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
       */
      [
        'get', '/api/v1/users/:id',
        this.authValidator.loggedOnly,
        this.userValidator.getUser,
        this.getUser.bind(this)
      ],
      /**
       * @swagger
       *
       * /users:
       *  get:
       *    description: Get users list
       *    produces:
       *      - application/json
       *    tags:
       *      - User
       *    parameters:
       *      - name: search
       *        description: Filter by PeerPlays Account Name
       *        in: query
       *        required: false
       *        type: string
       *      - name: limit
       *        description: Limit of rows
       *        in: query
       *        required: true
       *        type: integer
       *      - name: skip
       *        description: Number of rows to skip
       *        in: query
       *        required: false
       *        type: integer
       *    responses:
       *      200:
       *        description: Users response
       *        schema:
       *          $ref: '#/definitions/UsersResponse'
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
        'get', '/api/v1/users',
        this.authValidator.loggedOnly,
        this.userValidator.getUsers,
        this.getUsers.bind(this)
      ],
      /**
       * @swagger
       *
       * /profile/permission:
       *  get:
       *    description: Get user permissions
       *    summary: Get user permissions
       *    produces:
       *      - application/json
       *    tags:
       *      - Profile
       *    responses:
       *      200:
       *        description: Get user permissions
       *        schema:
       *          $ref: '#/definitions/Permissions'
       *      401:
       *        description: Error user unauthorized
       *        schema:
       *          $ref: '#/definitions/UnauthorizedError'
       */
      [
        'get', '/api/v1/permission',
        this.authValidator.loggedOnly,
        this.getPermission.bind(this)
      ]
    ];
  }

  async getUser(user, id) {
    try {
      return await this.userService.getUser(id);
    } catch (e) {
      throw new RestError(e.message, 404);
    }
  }

  async getUsers(user, {search, limit, skip}) {
    skip = skip || 0;
    return await this.userService.searchUsers(search, limit, skip);
  }

  async getPermission(user) {
    return await this.userService.getPermission(user);
  }
}

module.exports = UsersController;
