const express = require('express');
const debug = require('debug')('app:bookRoutes');
const { MongoClient } = require('mongodb');
const {ObjectId} = require('mongodb');

const bookRouter = express.Router();


function router(nav) {
  bookRouter.route('/')
    .get((req, res) => {
      const url = 'mongodb://localhost:27017';
      const dbname = 'LibraryApp';
      (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('connnect mongo');
          const db = client.db(dbname);
          const col = await db.collection('books');
          const books = await col.find().toArray();

          res.render('books', {
            nav,
            title: '# Les Livres',
            books,
          });
        } catch (err) {
          debug(err.stack);
        }
        client.close();
      }());
    });


  bookRouter.route('/:id')
    .all((req, res, next) => {
      const { id } = req.params;
      const url = 'mongodb://localhost:27017';
      const dbname = 'LibraryApp';
      (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('connnect mongo');
          const db = client.db(dbname);
          const col = await db.collection('books');
          const books = await col.find({ _id: ObjectId(id) })
            .toArray();
          req.book = books;
          next();
        } catch (err) {
          debug(err.stack);
        }
        client.close();
      }());
    })
    .get((req, res) => {

      res.render('books', {
        nav,
        title: '# Livre',
        books: req.book,
      });
    });

  return bookRouter;
}


module.exports = router;
