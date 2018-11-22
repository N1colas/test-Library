const passport = require('passport');
const { Strategy } = require('passport-local');
const debug = require('debug')('app:Strategy');
const { MongoClient } = require('mongodb');

module.exports = function localStrategy() {
  passport.use(new Strategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    }, (username, password, done) => {
      const user = { username, password };
      const url = 'mongodb://localhost:27017';
      const dbname = 'LibraryApp';
      (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('connecting');
          const user = client.db(dbname).collection('users').findOne({ username });
          if (user.password === password) {
            done(null, user);
          } else {
            done(null, false);
          }
        } catch (err) {
          console.log(err.stack);
        }
      }());
    },
  ));
};
