'use strict';

const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

mongoose.Promise = global.Promise;

const authorSchema = mongoose.Schema({  
  firstName: 'string',
  lastName: 'string',
  userName: {
    type: 'string',
    unique: true
  }
});

const commentSchema = mongoose.Schema({content: 'string'});

const blogSchema = mongoose.Schema({
  title: 'string',
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
  content: 'string',
  comments: [commentSchema]
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

authorSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`.trim();
});

blogSchema.virtual('fullName').get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim();
});

authorSchema.methods.serialize = function() {
  return {
    id: this._id,
    name: this.fullName,
    userName: this.userName
  };
};

blogSchema.methods.serialize = function() {
  return {
    id: this._id,
    title: this.title,
    author: this.fullName,
    content: this.content,
    comments: this.comments
  };
};

const Author = mongoose.model('Author', authorSchema);
const Blog = mongoose.model('Blog', blogSchema);

module.exports = { Author, Blog };
