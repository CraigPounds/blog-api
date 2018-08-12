'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {BlogPosts} = require('./models');

BlogPosts.create('AI & Humans', 'Humans can be trusted to behave unethically with any technology', 'Napes Weaver');

router.get('/', (req, res) => {
  res.json(BlogPosts.get());
});

router.post('/', jsonParser, (req, res) => {
  const blog = BlogPosts.create(req.body.title, req.body.content, req.body.author);
  res.status(201).json(blog);
});

router.put('/:id', jsonParser, (req, res) => {
  BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    publishDate: Date.now()
  });
  res.status(204).end();
});

router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted blog \`${req.params.id}\``);
  res.status(204).end();
});

module.exports = router;