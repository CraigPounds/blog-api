'use strict';

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const app = express();

const authorRouter = require('./author-router');
const blogRouter = require('./blog-router');

const { PORT, DATABASE_URL } = require('./config');

mongoose.Promise = global.Promise;

app.use(morgan('common'));

app.use(express.static('public'));
app.use(express.json());

app.use('/authors', authorRouter);
app.use('/posts', blogRouter);

let server;

function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(
      databaseUrl,
      { useNewUrlParser: true },
      err => {
        if (err) {
          return reject(err);
        }
        server = app
          .listen(port, () => {
            console.log(`Your app is listening on port ${port}`);
            resolve();
          })
          .on('error', err => {
            mongoose.disconnect();
            reject(err);
          });
      });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };