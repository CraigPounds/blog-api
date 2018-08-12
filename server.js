// Use Express router and modularize routes to /blog-posts

'use strict';

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const {BlogPosts} = require('./models');
const jsonParser = bodyParser.json();
const app = express();

app.use(morgan('common'));

BlogPosts.create('AI & Humans', 'Humans can be trusted to behave unethically with any technology', 'Napes Weaver');

app.get('/blog-posts', (req, res) => {
  res.json(BlogPosts.get());
});

app.post('/blog-posts', jsonParser, (req, res) => {
  const blog = BlogPosts.create(req.body.title, req.body.content, req.body.author);
  res.status(201).json(blog);
});

app.put('/blog-posts/:id', jsonParser, (req, res) => {
  BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    publishDate: Date.now()
  });
  res.status(204).end();
});

app.delete('/blog-posts/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted blog \`${req.params.id}\``);
  res.status(204).end();
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});