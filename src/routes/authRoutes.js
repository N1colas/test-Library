const express = require('express');
const debug = require('debug')('app:authRoutes');
const { MongoClient } = require('mongodb');
const passport = require('passport');

const authRouter = express.Router();


function router(nav) {
  authRouter.route('/signup').post((req, res) => {
    const url = 'mongodb://localhost:27017';
    const dbname = 'LibraryApp';
    const { username, password } = req.body;
    (async function addUser() {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('connecting');
        const db = client.db(dbname);
        const col = await db.collection('users');
        const user = { username, password };
        const result = await col.insertOne(user);
        debug(result);

        req.login(result.ops[0], () => {
          res.redirect('/auth/profile');
        });
      } catch (err) {
        debug(err.stack);
      }
      client.close();
    }());
  });
  authRouter.route('/profile').get((req, res) => {
    debug(req);
    res.json(req.user);
  });
  authRouter.route('/signin')
    .get((req, res) => {
      res.render('signin', {
        nav,
        title: '# sign in',
        books: req.book,
      });
    })
    .post(passport.authenticate('local', {
      successRedirect: '/auth/profile',
      failureRedirect: '/',
    }));
  return authRouter;
}


module.exports = router;
