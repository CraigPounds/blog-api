'use strict';

const express = require('express');
const router = express.Router();
const { Author, Blog } = require('./models');

router.get('/', (req, res) => {
  Blog
    .find()
    .then(blogposts => {
      res.json({
        blogposts: blogposts.map(blog => blog.serialize())
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error'});
    });
});

router.get('/:id', (req, res) => {
  Blog
    .findById(req.params.id)
    .then(blog => res.json(blog.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error'});
    });
});

router.post('/', (req, res) => {
  const requiredFields = ['title', 'content', 'author_id'];
  requiredFields.forEach(field => {
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  });

  Author
    .findById(req.body.author_id)
    .then(author => {
      if (author) {
        Blog
          .create({
            title: req.body.title,
            content: req.body.content,
            author: req.body.author_id
          })
          .then(blogPost => res.status(201).json({
            id: blogPost.id,
            author: `${author.firstName} ${author.lastName}`,
            content: blogPost.content,
            title: blogPost.title,
            comments: blogPost.comments
          }))
          .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error'});
          });
      }
      else {
        const message = 'Author not found';
        console.error(message);
        return res.status(400).send(message);
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error'});
    });
});

router.put('/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  const updated = {};
  const updateable = ['title', 'content'];
  updateable.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  Blog
    .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
    .then(updatedPost => res.status(200).json({
      id: updatedPost.id,
      title: updatedPost.title,
      content: updatedPost.content
    }))
    .catch(err => res.status(500).json({ message: err }));
});

router.delete('/:id', (req, res) => {
  Blog.findByIdAndDelete(req.params.id)
    .then(blog => res.status(204).end())
    .catch(err => { 
      console.error(err);
      res.status(500).json({ message: 'Internal server error'});
    });
});

router.use('*', function(req, res) {
  res.status(404).json({ message: 'Not Found' });
});

module.exports = router;