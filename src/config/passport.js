const passport = require('passport');

require('./Strategies/local.strategy')();

module.exports = function passportConfig(app) {
  debugger
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};
