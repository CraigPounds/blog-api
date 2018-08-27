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


const Author = mongoose.model('Author', authorSchema);
const BlogPost = mongoose.model('BlogPost', blogSchema);

Author
  .create({
    'firstName': 'Sarah',
    'lastName': 'Clarke',
    'userName': 'sarah.clarke'
  })
  .then(author => {
    BlogPost
      .create({
        title: 'another title',
        content: 'a bunch more amazing words',
        author: author._id
      });
  });

BlogPost
  .findOne({
    title: 'some title'
  })
  .then(post => {
    post.comments.push({ content: 'a comment on that last comment' });
    post.save();
  });

BlogPost
  .findOne({
    title: 'some title'
  })
  .then(post => {
    post.comments.id(post.comments[0]._id).remove();
    post.save();
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

const Blog = mongoose.model('Blog', blogSchema);

module.exports = { Blog };
