'use strict';

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const app = express();
const blogRouter = require('./blogRouter');

mongoose.Promise = global.Promise;
const { PORT, DATABASE_URL } = require('./config');
const { Blogs } = require('./models');

app.use(morgan('common'));
app.use(express.static('public'));
app.use(express.json());
app.use('/blog-posts', blogRouter);

let server;

function runServer(databaseUrl, port=PORT) {
  // const port = process.env.PORT || 8080;
  return new Promise((resolve, reject) => {
    // server = app
    // .listen(port, () => {
    //   console.log(`Your app is listening on port ${port}`);
    //   resolve(server);
    // })
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve;
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
  runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };