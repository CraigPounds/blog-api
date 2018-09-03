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
        const message = 'Username taken';
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

// router.put('/:id', (req, res) => {
//   if(!(req.params.id && req.body.id && req.params.id === req.body.id)) {
//     const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
//     console.error(message);
//     return res.status(400).json({ message: message });
//   }
//   const toUpdate = {};
//   const updateable = ['firstName', 'lastName', 'userName'];
//   updateable.forEach(field => {
//     if(field in req.body) {
//       toUpdate[field] = req.body[field];
//     }
//   });
//   Author
//     .findOneAndUpdate(req.params.id, { $set: toUpdate }, { new: true })
//     .then(author => res.status(204).end())
//     .catch(err => {
//       console.error(err);
//       res.status(500).json({ message: 'Internal server error' });
//     });
// });

router.put('/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }
  const updated = {};
  const updateable = ['firstName', 'lastName', 'userName'];
  updateable.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });
  console.log('testing', req.params.id);
  Author
    .findOne({ userName: updated.userName || '', _id: { $ne: req.params.id } })
    .then(author => {
      if(author) {
        const message = 'Username taken';
        console.error(message);
        return res.status(400).send(message);
      }
      else {
        Author
          .findOneAndUpdate(req.params.id, { $set: updated }, { new: true })
          .then(updatedAuthor => {
            res.status(200).json({
              id: updatedAuthor.id,
              name: `${updatedAuthor.firstName} ${updatedAuthor.lastName}`,
              userName: updatedAuthor.userName
            });
          })
          .catch(err => res.status(500).json({ message: err }));
      }
    });
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