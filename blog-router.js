'use strict';

const express = require('express');
const router = express.Router();
const { Author, Blog } = require('./models');

router.get('/', (req, res) => {
  Blog
    .find()
    .then(blogposts => {
      // res.json({
      //   blogposts: blogposts.map(blog => blog.serialize())
      // });
      res.json(blogposts.map(blog => {
        return {
          id: blog._id,
          author: blog.authorName,
          content: blog.content,
          title: blog.title
        };
      }));
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
            author: req.body.id
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
            res.status(500).json({ error: 'Something went wrong' });
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
      res.status(500).json({ error: 'something went horribly awry' });
    });
});

router.put('/:id', (req, res) => {
  if(!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
    console.error(message);
    return res.status(400).json({ message: message });
  }
  const toUpdate = {};
  const updateable = ['title', 'content', 'author'];
  updateable.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });
  Blog
    .findOneAndUpdate(req.params.id, { $set: toUpdate })
    .then(blog => res.status(204).end())
    .catch(err => { 
      console.error(err);
      res.status(500).json({ message: 'Internal server error'});
    });
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