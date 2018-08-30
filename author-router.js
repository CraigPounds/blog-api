'use strict';

const express = require('express');
const router = express.Router();
const { Author, Blog } = require('./models');

router.get('/', (req, res) => {
  Author
    .find()
    .then(authors => {
      res.json({
        authors: authors.map(author => author.serialize())
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error'});
    });
});

router.post('/', (req, res) => {
  const requiredFields = ['firstName', 'lastName', 'userName'];
  requiredFields.forEach(field => {
    if(!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  });
  Author
    .findOne({ userName: req.body.userName })
    .then(author => {
      if (author) {
        const message = 'Username must be unique';
        console.error(message);
        return res.status(400).send(message);
      } else {
        Author
          .create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userName: req.body.userName
          })
          .then(author => res.status(201).json({
            _id: author.id,
            name: author.serialize(),
            userName: author.userName
          }))
          .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Internal server error'});
          });
      }
    })
    .catch(err => {
      console.error(err); 
      res.status(500).json({ error: 'Internal server error'});
    });
});

router.put('/:id', (req, res) => {

});

router.delete('/:id', (req, res) => {
  Blog
    .deleteMany({ author: req.params.id })
    .then(() => {
      Author.findByIdAndDelete(req.params.id)
        .then(() => {
          res.status(204).end();       
        });        
    })
    .catch(err => { 
      console.error(err);
      res.status(500).json({ message: 'Internal server error'});
    });
});

router.use('*', function(req, res) {
  res.status(404).json({ message: 'Not Found' });
});

module.exports = router;