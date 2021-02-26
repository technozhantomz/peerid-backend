const passport = require('passport');
const FacebookStrategy = require('passport-facebook');

class FacebookController {

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
     * /auth/facebook:
     *  get:
     *    description: Auth by facebook
     *    summary: Auth by facebook
     *    produces:
     *      - application/json
     *    tags:
     *      - SocNetwork
     *    responses:
     *      302:
     *        description: Redirect to facebook
     */
    this.initializePassport();
    app.get('/api/v1/auth/facebook', (req, res, next) => {
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

      passport.authenticate('facebook',{scope: ['email']})(req, res, next);
    });

    app.get('/api/v1/auth/facebook/callback', (req, res) => {
      passport.authenticate(
        'facebook',
        {failureRedirect: `${this.config.frontendUrl}/error?facebook-auth-error=restrict`}
      )(req, res, (err) => {

        if (err) {
          res.redirect(`${this.config.frontendUrl}/error?facebook-auth-error=${err.message}`);
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
    passport.use(new FacebookStrategy({
      passReqToCallback: true,
      clientID: this.config.facebook.clientId,
      clientSecret: this.config.facebook.clientSecret,
      callbackURL: `${this.config.backendUrl}/api/v1/auth/facebook/callback`,
      profileFields: ['id', 'name', 'picture', 'email']
    }, (req, token, tokenSecret, profile, done) => {
      this.userService.getUserBySocialNetworkAccount('facebook', {
        ...profile._json,
        username: profile._json.first_name.toLowerCase() + profile._json.id
      }, token, req).then((User) => {
        this.sessionRepository.limitSessions(User.id);
        this.userService.getCleanUser(User).then((user) => done(null, user));
      }).catch((error) => {
        done(error);
      });
    }));
  }

}

module.exports = FacebookController;
