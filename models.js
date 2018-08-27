'use strict';

const mongoose = require('mongoose');

// mongoose.Promise = global.Promise;

const authorSchema = mongoose.Schema({
  firstName: 'string',
  lastName: 'string',
  userName: {
    type: 'string',
    unique: true
  }
});

const commentSchema = mongoose.Schema({type: 'string'});

const blogSchema = mongoose.Schema({
  title: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
  content: { type: String },
  // created: {type: Date, default: Date.now},
  comments: [commentSchema]
});

// 'pre hook' ~  Mongoose query middleware function to populate author data before each call to findOne()
blogSchema.pre('findOne', function(next) {
  this.populate('author');
  next();
});

blogSchema.pre('find', function(next) {
  this.populate('author');
  next();
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
    // created: this.created
  };
};

const Author = mongoose.model('Author', authorSchema);
const Blog = mongoose.model('Blog', blogSchema);

module.exports = { Author, Blog };
