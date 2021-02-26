const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

class GoogleController {

  /**
   * @param {UserService} opts.userService
   * @param {AppConfig} opts.config
   * @param {SessionRepository} opts.sessionRepository
   */
  constructor(opts) {
    this.userService = opts.userService;
    this.config = opts.config;
    this.sessionRepository = opts.sessionRepository;

    this.DEFAULT_SCOPE = [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ];
  }

  /**
   * Array of routes processed by this controller
   * @returns {*[]}
   */
  getRoutes(app) {
    /**
     * @swagger
     *
     * /auth/google:
     *  get:
     *    description: Auth by google
     *    summary: Auth by google
     *    produces:
     *      - application/json
     *    tags:
     *      - SocNetwork
     *    responses:
     *      302:
     *        description: Redirect to google
     */
    this.initializePassport();
    app.get('/api/v1/auth/google', (req, res, next) => {
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

      passport.authenticate('google', {
        scope: this.DEFAULT_SCOPE,
        access_type: 'offline'
      })(req, res, next);
    });

    app.get('/api/v1/auth/google/callback', (req, res) => {
      passport.authenticate(
        'google',
        {failureRedirect: `${this.config.frontendUrl}/error?google-auth-error=restrict`}
      )(req, res, (err) => {

        if (err) {
          res.redirect(`${this.config.frontendUrl}/error?google-auth-error=${err.message}`);
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
    passport.use(new GoogleStrategy({
      passReqToCallback: true,
      clientID: this.config.google.clientId,
      clientSecret: this.config.google.clientSecret,
      callbackURL: `${this.config.backendUrl}/api/v1/auth/google/callback`
    }, (req, accessToken, profile, done) => {
      this.userService.getUserBySocialNetworkAccount('google', {
        id: profile.id,
        ...profile._json,
        username: profile._json.email.replace(/@.+/, '')
      }, accessToken, req).then((User) => {
        this.sessionRepository.limitSessions(User.id);
        this.userService.getCleanUser(User).then((user) => done(null, user));
      }).catch((error) => {
        done(error);
      });
    }));
  }

}

module.exports = GoogleController;
