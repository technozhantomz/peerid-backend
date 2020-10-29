
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const moment = require('moment');
const {Login} = require('peerplaysjs-lib');
const RestError = require('../errors/rest.error');
const PeerplaysNameExistsError = require('./../errors/peerplays-name-exists.error');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

class UserService {

  /**
     * @param {UserRepository} opts.userRepository
     * @param {PeerplaysRepository} opts.peerplaysRepository
     * @param {VerificationTokenRepository} opts.verificationTokenRepository
     * @param {ResetTokenRepository} opts.resetTokenRepository
     * @param {MailService} opts.mailService
     * @param {PermissionRepository} opts.permissionRepository
     * @param {AuthorityRepository} opts.authorityRepository
     * @param {PeerplaysConnection} opts.peerplaysConnection
     */
  constructor(opts) {
    this.config = opts.config;
    this.userRepository = opts.userRepository;
    this.peerplaysRepository = opts.peerplaysRepository;
    this.peerplaysConnection = opts.peerplaysConnection;
    this.verificationTokenRepository = opts.verificationTokenRepository;
    this.resetTokenRepository = opts.resetTokenRepository;
    this.mailService = opts.mailService;
    this.permissionRepository = opts.permissionRepository;
    this.authorityRepository = opts.authorityRepository;

    this.errors = {
      USER_NOT_FOUND: 'USER_NOT_FOUND',
      TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
      PEERPLAYS_ACCOUNT_MISSING: 'PEERPLAYS_ACCOUNT_MISSING'
    };

    this.RESET_TOKEN_TIME_INTERVAL = 10;
  }

  /**
   *
   * @param {String} username
   * @param {Number} numRetries
   */
  async createUserForSocialNetwork(username, numRetries = 0) {
    const MAX_RETRIES = 5;

    if (numRetries >= MAX_RETRIES) {
      throw new Error('failed to create user, too many retries');
    }

    const randomString = `${Math.floor(Math.min(1000 + Math.random() * 9000, 9999))}`; // random 4 digit number

    try {
      return await this.userRepository.model.create({
        username: numRetries === 0 ? username : `${username}-${randomString}`
      });
    } catch (err) {
      return this.createUserForSocialNetwork(username, numRetries + 1);
    }
  }

  /**
     * @param {String} username
     * @param {String} password
     * @param {Number} numRetries
     */
  async createPeerplaysAccountForSocialNetwork(username, password, numRetries = 0) {
    const MAX_RETRIES = 5;

    if (numRetries >= MAX_RETRIES) {
      throw new Error('failed to create peerplays account, too many retries');
    }

    const hash = crypto.createHash('sha256').digest(username).toString('hex').slice(0, 32);
    const randomString = `${Math.floor(Math.min(1000 + Math.random() * 9000, 9999))}`; // random 4 digit number
    const seUsername = numRetries === 0 ? `pi-${hash}` : `pi-${hash}-${randomString}`;

    const keys = Login.generateKeys(
      seUsername,
      password,
      ['owner', 'active'],
      IS_PRODUCTION ? 'PPY' : 'TEST'
    );

    const ownerKey = keys.pubKeys.owner;
    const activeKey = keys.pubKeys.active;

    try {
      return await this.peerplaysRepository.createPeerplaysAccount(seUsername, ownerKey, activeKey);
    } catch (err) {
      if (err instanceof PeerplaysNameExistsError) {
        return await this.createPeerplaysAccountForSocialNetwork(username, password, numRetries + 1);
      }

      throw err;
    }
  }

  /**
     * Find user by network account id and create row if not exists
     * @param {String} network
     * @param account
     * @param {String} accessToken
     * @param {} req
     * @returns {Promise<UserModel>}
     */
  async getUserBySocialNetworkAccount(network, account, accessToken, req) {
    const loggedUser = req.user;
    req.session.newUser = false;
    req.session.save();

    const {id, email, username} = account;
    const UserWithNetworkAccount = await this.userRepository.model.findOne({where: {[`${network}Id`]: id}});

    if (UserWithNetworkAccount && loggedUser && loggedUser.id !== UserWithNetworkAccount.id) {
      throw new Error('this account is already connected to another profile');
    }

    if (loggedUser) {
      return await this.connectSocialNetwork(network, account, loggedUser);
    }

    if (UserWithNetworkAccount) {
      return UserWithNetworkAccount;
    }

    req.session.newUser = true;
    req.session.save();

    const emailIsUsed = email && await this.userRepository.model.count({where: {email}});
    const User = await this.createUserForSocialNetwork(username);

    User[`${network}Id`] = id;
    User.email = emailIsUsed ? null : email;
    User.isEmailVerified = emailIsUsed ? null : true;
    User.googleName = network === 'google' ? username : '';
    User.facebook = network === 'facebook' ? username : '';

    const peerplaysPassword = `${User.username}-${accessToken}`;
    const peerplaysAccount = await this.createPeerplaysAccountForSocialNetwork(User.username, peerplaysPassword);

    User.peerplaysAccountName = peerplaysAccount.name;
    User.peerplaysAccountId = await this.peerplaysRepository.getAccountId(peerplaysAccount.name);
    await User.save();

    await this.createCustomPermission(User, peerplaysPassword);

    await this.mailService.sendMailMasterPassword(username, email, peerplaysPassword);

    return User;
  }

  async connectSocialNetwork(network, account, User) {
    const {id, email, username} = account;

    if (User[`${network}Id`] === id) {
      return User;
    }

    const emailIsUsed = email && await this.userRepository.model.count({where: {email}});
    const usernameIsUsed = username && await this.userRepository.model.count({where: {username}});
    User[`${network}Id`] = id;

    if (network === 'google') {
      User.googleName = username;
    } else if (network === 'facebook') {
      User.facebook = username;
    } else {
      throw new RestError(`Unexpected Network ${network}`);
    }

    if (!User.email && !emailIsUsed) {
      User.email = email;
    }

    if (User.email === email) {
      User.isEmailVerified = true;
    }

    if (!User.username && !usernameIsUsed) {
      User.username = username;
    }

    await User.save();
    return User;
  }

  /**
     * @param {UserModel} User
     * @returns {Promise<UserPublicObject>}
     */
  async getCleanUser(User) {
    return User.getPublic();
  }

  async getPermission(user) {
    return await this.permissionRepository.model.findOne({
      where: {
        user_id: user.id
      }
    });
  }

  async getUser(id) {
    const User = await this.userRepository.findByPk(id);

    if (!User) {
      throw new Error('User not found');
    }

    return this.getCleanUser(User);
  }

  /**
     * @param {UserModel} User
     * @param name
     * @param activeKey
     * @param ownerKey
     * @returns {Promise<UserModel>}
     */
  async createPeerplaysAccount(User, {name, activeKey, ownerKey}) {
    try {
      await this.peerplaysRepository.createPeerplaysAccount(name, ownerKey, activeKey);
    } catch (details) {
      let error = details;

      if(error.base){
        error = {
          message: error.base.length > 0 ? error.base : 'Invalid active or owner key. '
        };
      }

      throw new RestError('Request error', 400, error);
    }

    User.peerplaysAccountName = name;
    await User.save();
    return this.getCleanUser(User);
  }


  /**
   * @param {UserModel} User
   * @returns {Promise<UserPublicObject>}
   */
  async getCleanUserForSearch(User) {
    return User.getPublicMinimal();
  }

  /**
     * Get a list of users corresponding to the specified parameters
     *
     * @param search
     * @param limit
     * @param skip
     * @returns {Promise<[UserModel]>}
     */
  async searchUsers(search, limit, skip) {
    const users = await this.userRepository.searchUsers(search, limit, skip);
    return Promise.all(users.map(async (User) => this.getCleanUserForSearch(User)));
  }

  makepassword(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%*';
    var charactersLength = characters.length;

    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
 }

  async signUpWithPassword(email, username, unhashedPassword, mobile) {
    let password = unhashedPassword;

    if(!unhashedPassword) {
      password = this.makepassword(16);
    }

    if(!username) {
      username = this.makepassword(20);
    }

    const peerplaysAccountUsername = `pi-${username}`;
    const peerplaysAccountPassword = await bcrypt.hash(`pi-${password}${(new Date()).getTime()}`, 10);
    const keys = Login.generateKeys(
      peerplaysAccountUsername,
      peerplaysAccountPassword,
      ['owner', 'active'],
      IS_PRODUCTION ? 'PPY' : 'TEST'
    );
    const ownerKey = keys.pubKeys.owner;
    const activeKey = keys.pubKeys.active;

    password = await bcrypt.hash(password, 10);
    const User = await this.userRepository.model.create({
      email, username, password, mobile
    });
    const {token} = await this.verificationTokenRepository.createToken(User.id, email);

    await this.mailService.sendMailAfterRegistration(username, email, peerplaysAccountPassword, token);

    await this.peerplaysRepository.createPeerplaysAccount(peerplaysAccountUsername,ownerKey, activeKey);

    User.peerplaysAccountName = peerplaysAccountUsername;
    User.peerplaysAccountId = await this.peerplaysRepository.getAccountId(peerplaysAccountUsername);
    await User.save();

    await this.createCustomPermission(User, peerplaysAccountPassword);

    return this.getCleanUser(User);
  }

  async confirmEmail(ActiveToken) {
    const User = await this.userRepository.findByPk(ActiveToken.userId);
    User.isEmailVerified = true;
    await User.save();
    ActiveToken.isActive = false;
    await ActiveToken.save();
    return this.getCleanUser(User);
  }

  async getSignInUser(login, password, mobile) {
    const User = await this.userRepository.getByLogin(login);

    if (!User) {
      throw new Error('User not found');
    }

    if(User && User.isEmailVerified === false){
      throw new Error('Please verify your email address first');
    }

    if (password && !await bcrypt.compare(password, User.password)) {
      throw new Error('Invalid password');
    }

    if (mobile && User.mobile != mobile) {
      throw new Error('Mobile doesn\'t match email');
    }

    return this.getCleanUser(User);
  }

  async sendResetPasswordEmail(email) {
    const User = await this.userRepository.model.findOne({
      where: {email},
      include: [{
        model: this.resetTokenRepository.model
      }],
      order: [[{model: this.resetTokenRepository.model}, 'createdAt']]
    });

    if (!User) {
      throw new Error(this.errors.USER_NOT_FOUND);
    }

    if (User['reset-tokens'].length) {
      const lastReset = User['reset-tokens'][User['reset-tokens'].length - 1];

      if (moment().diff(lastReset.createdAt, 'second') < this.RESET_TOKEN_TIME_INTERVAL) {
        throw new Error(this.errors.TOO_MANY_REQUESTS);
      }

      await Promise.all(User['reset-tokens'].map(async (resetToken) => {
        resetToken.isActive = false;
        return await resetToken.save();
      }));
    }

    const {token} = await this.resetTokenRepository.createToken(User.id);
    await this.mailService.sendMailResetPassword(User.username, email, token);
    return true;
  }

  async resetPassword(User, password) {
    User.password = await bcrypt.hash(password, 10);
    await User.save();

    return this.getCleanUser(User);
  }

  async changeEmail(ActiveToken) {
    const User = await this.userRepository.findByPk(ActiveToken.userId);
    User.isEmailVerified = true;
    User.email = ActiveToken.email;

    await User.save();
    ActiveToken.isActive = false;
    await ActiveToken.save();
    return User.getPublic();
  }

  async loginPeerplaysUser(login, password, LoggedUser = null) {
    const PeerplaysUser = await this.peerplaysRepository.getPeerplaysUser(login, password);

    if (!PeerplaysUser) {
      throw new RestError('', 400, {login: [{message: 'Invalid peerplays account'}]});
    }

    const userWithPeerplaysAccount = await this.userRepository.getByPeerplaysAccountName(login);

    if (userWithPeerplaysAccount && LoggedUser && LoggedUser.id !== userWithPeerplaysAccount.id) {
      throw new RestError('', 409, {login: [{message: 'This account is already connected to another profile'}]});
    }

    if(userWithPeerplaysAccount) {
      const user = await this.getCleanUser(userWithPeerplaysAccount);
      user['newUser'] = false;
      return user;
    }

    //If the user is already logged in and no peerplays account is linked then link this account
    if(LoggedUser && !userWithPeerplaysAccount) {
      LoggedUser.peerplaysAccountName = login;
      LoggedUser.peerplaysAccountId = PeerplaysUser[1].account.id;
      await LoggedUser.save();
      const user = await this.getCleanUser(LoggedUser);
      user['newUser'] = false;
      return user;
    }

    const NewUser = await this.userRepository.model.create({
      username: await this.getUsernameForPeerplaysAccount(login),
      peerplaysAccountName: login,
      peerplaysAccountId: PeerplaysUser[1].account.id
    });

    await NewUser.save();

    await this.createCustomPermission(NewUser, password);
    const user = await this.getCleanUser(NewUser);
    user['newUser'] = true;
    return user;
  }

  async getUsernameForPeerplaysAccount(accountName, numRetries=0){
    const MAX_RETRIES = 5;
    let username = accountName;

    if (numRetries >= MAX_RETRIES) {
      throw new RestError('Failed to create user, too many retries',400);
    }

    const UsernameExists = await this.userRepository.getByLogin(username);

    if(UsernameExists) {
      const randomString = `${Math.floor(Math.min(1000 + Math.random() * 9000, 9999))}`; // random 4 digit number
      username = this.getUsernameForPeerplaysAccount(accountName + randomString, numRetries + 1);
    }

    return username;
  }

  randomizePermissionName() {
    let text = '';
    const possible = 'abcdefghijklmnopqrstuvwxyz';

    for (let i = 0; i < 7; i++) { text += possible.charAt(Math.floor(Math.random() * possible.length)); }

    return text;
  }

  async createCustomPermission(user, peerplaysPassword) {
    let permissionName = `pid${this.randomizePermissionName()}`;
    try {
      const customPermission = await this.peerplaysRepository.createAndSendTransaction('custom_permission_create',{
        fee: {
          amount: 0,
          asset_id: this.config.peerplays.feeAssetId
        },
        owner_account: user.peerplaysAccountId,
        permission_name: permissionName,
        auth: {
          weight_threshold: 1,
          account_auths: [[this.config.peerplays.paymentAccountID, 1]],
          key_auths: [],
          address_auths: []
        },
        extensions: null
      }, user.peerplaysAccountName, peerplaysPassword);

      const Permission = await this.permissionRepository.model.create({
        peerplays_permission_id: customPermission.trx.operation_results[0][1],
        permission_name: permissionName,
        peerplays_account_id: user.peerplaysAccountId,
        user_id: user.id
      });

      let today = new Date();
      let year = today.getFullYear();
      let month = today.getMonth();
      let day = today.getDate();
      let threeMonthsFromNow = new Date(year, month + 3, day);
      const Ops = [85, 86, 87];

      for(let i = 0; i < Ops.length; i++) {
        const customAuth = await this.peerplaysRepository.createAndSendTransaction('custom_account_authority_create', {
          fee: {
            amount: 0,
            asset_id: this.config.peerplays.feeAssetId
          },
          permission_id: customPermission.trx.operation_results[0][1],
          operation_type: Ops[i],
          valid_from: Math.floor(new Number(today)/1000),
          valid_to: Math.floor(new Number(threeMonthsFromNow)/1000),
          owner_account: user.peerplaysAccountId,
          extensions: null
        }, user.peerplaysAccountName, peerplaysPassword);

        await this.authorityRepository.model.create({
          peerplays_permission_id: Permission.peerplays_permission_id,
          peerplays_account_auth_id: customAuth.trx.operation_results[0][1],
          operation: Ops[i],
          expiry: threeMonthsFromNow,
          app_id: app.id,
          user_id: user.id,
          permission_id: Permission.id
        });
      }
    } catch(err) {
      logger.error(err);
      throw new Error('Peerplays HRP Error');
    }
  }

  async getPermission(user) {
    return this.permissionRepository.model.findOne({
      where: {
        user_id: user.id
      }
    });
  }

}

module.exports = UserService;
