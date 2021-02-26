const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;

class DiscordController {

  /**
   * @param {UserService} opts.userService
   * @param {AppConfig} opts.config
   * @param {SessionRepository} opts.sessionRepository
   */
  constructor(opts) {
    this.userService = opts.userService;
    this.config = opts.config;
    this.sessionRepository = opts.sessionRepository;
  }

  /**
   * Array of routes processed by this controller
   * @returns {*[]}
   */
  getRoutes(app) {
    /**
     * @swagger
     *
     * /auth/discord:
     *  get:
     *    description: Auth by Discord
     *    summary: Auth by discord
     *    produces:
     *      - application/json
     *    tags:
     *      - SocNetwork
     *    responses:
     *      302:
     *        description: Redirect to discord
     */
    this.initializePassport();
    app.get('/api/v1/auth/discord', (req, res, next) => {
      if (req.query.client_id && req.query.redirect_uri) {
        req.session.appId = req.query.client_id;
        req.session.redirectURI = req.query.redirect_uri;

        if(req.query.state) {
          req.session.state = req.query.state;
        }

        req.session.save();
      } else {
        req.session.appId = null;
        req.session.redirectURI = null;
      }

      passport.authenticate('discord',{scope: ['identify', 'email']})(req, res, next);
    });

    app.get('/api/v1/auth/discord/callback', (req, res) => {
      passport.authenticate(
        'discord',
        {failureRedirect: `${this.config.frontendUrl}/error?discord-auth-error=restrict`}
      )(req, res, (err) => {

        if (err) {
          res.redirect(`${this.config.frontendUrl}/error?discord-auth-error=${err.message}`);
          return;
        }

        if(req.session.redirectURI) {
          let query = `?client_id=${req.session.appId}&redirect_uri=${req.session.redirectURI}`;

          if(req.query.state) {
            query = `${query}&state=${req.session.state}`;
          }

          res.redirect(`${this.config.frontendCallbackUrl}/permissions${query}`);
        }else {
          res.redirect(`${this.config.frontendCallbackUrl}`);
        }
      });

    });

    return [];
  }

  initializePassport() {
    passport.use(new DiscordStrategy({
      passReqToCallback: true,
      clientID: this.config.discord.clientId,
      clientSecret: this.config.discord.clientSecret,
      callbackURL: `${this.config.backendUrl}/api/v1/auth/discord/callback`,
      scope: ['identify', 'email']
    }, (req, token, refreshToken, profile, done) => {
      this.userService.getUserBySocialNetworkAccount('discord', profile, token, req).then((User) => {
        this.sessionRepository.limitSessions(User.id);
        this.userService.getCleanUser(User).then((user) => done(null, user));
      }).catch((error) => {
        done(error);
      });
    }));
  }

}

module.exports = DiscordController;
