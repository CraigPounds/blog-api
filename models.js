'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const blogSchema = mongoose.Schema({
  title: { type: String, required: true },
  author: {
    firstName: { type: String, required: false },
    lastName: { type: String, required: true }
  },
  content: { type: String },
  created: {type: Date, default: Date.now}
});

blogSchema.virtual('fullName').get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim();
});

blogSchema.methods.serialize = function() {
  return {
    id: this._id,
    title: this.title,
    author: this.fullName,
    content: this.content,
    created: this.created
  };
};

const Blog = mongoose.model('Blog', blogSchema);

module.exports = { Blog };
