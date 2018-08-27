'use strict';

const mongoose = require('mongoose');

// mongoose.Promise = global.Promise;

const authorSchema = mongoose.Schema({
  //firstName: { type: String },
  //lastName: { type: String, required: true },
  firstName: 'string',
  lastName: 'string',
  userName: {
    type: 'string',
    unique: true
  }
});

const commentSchema = mongoose.Schema({content: 'string'});

const blogSchema = mongoose.Schema({
  // title: { type: String, required: true },
  // content: { type: String },
  title: 'string',
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
  content: 'string',
  comments: [commentSchema]
  // created: {type: Date, default: Date.now},
});

// 'pre hook' ~  Mongoose query middleware function to populate author data before each call to find()
blogSchema.pre('find', function(next) {
  this.populate('author');
  next();
});

blogSchema.pre('findOne', function(next) {
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
    content: this.content
  };
};

const Author = mongoose.model('Author', authorSchema);
const Blog = mongoose.model('Blog', blogSchema);

module.exports = { Author, Blog };
