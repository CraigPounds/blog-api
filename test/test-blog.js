'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const faker = require('faker');
const mongoose = require('mongoose');
const { Author, Blog } = require('../models');
// const authorRouter = require('../author-router');
// const blogRouter = require('../blog-router');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');

chai.use(chaiHttp);

// function seedAuthorData() {
//   console.info('seeding author data');
//   const seedData = [];
//   for (let i = 1; i <= 10; i++) {
//     seedData.push(generateAuthorData());
//   }
//   return Author.insertMany(seedData);
// }

// function seedBlogData() {
//   console.info('seeding blog data');
//   const blogData = [];
//   return chai.request(app)
//     .get('/authors')
//     .then(function(res) {
//       res.body.authors.forEach(author => {
//         let newBlogData = generateBlogData(author._id);
//         blogData.push(newBlogData);
//       });
//       return Blog.insertMany(blogData);
//     });
// }

function seedData() {
  console.info('seeding author data');
  const seedData = [];
  for (let i = 1; i <= 10; i++) {
    seedData.push(generateAuthorData());
  }
  return Author.insertMany(seedData)
    .then(function() {
      console.info('seeding blog data');
      const blogData = [];
      return chai.request(app)
        .get('/authors')
        .then(function(res) {
          res.body.authors.forEach(author => {
            let newBlogData = generateBlogData(author._id);
            blogData.push(newBlogData);
          });
          return Blog.insertMany(blogData);
        });
    });  
}

function gernerateUserName() {
  return `${faker.name.firstName()} ${faker.name.lastName()}`;
}

function generateAuthorData() {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    userName: gernerateUserName()
  };
}

function generateCommenets() {
  let seedComments = [];
  const index = Math.floor(Math.random() * 5);

  for(let i = 0; i < index; i++) {
    const newComment = { comment: ''};
    newComment.comment = faker.lorem.paragraph();
    seedComments.push(newComment);
  }
  return seedComments;
}

function generateBlogData(id) {
  return {
    author: id,
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraph(),
    comments: generateCommenets()
  };
}

function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

describe('API resource', function() {
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });
  beforeEach(function() {
    // return seedAuthorData();
    return seedData();
  });
  // this.beforeEach(function() {
  //   return seedBlogData();
  // });
  afterEach(function() {
    return tearDownDb();
  });
  after(function() {
    return closeServer();
  }); 

  describe('GET authors endpoint', function() {
    it('should return all authors', function() {
      let res;
      return chai.request(app)
        .get('/authors')
        .then(function(_res) {
          res = _res;
          expect(res).to.have.status(200);
          expect(res.body.authors).to.have.lengthOf.at.least(1);
          return Author.countDocuments();
        })
        .then(function(count) {
          expect(res.body.authors).to.have.lengthOf(count);
        });
    });
    it('should return authors with correct fields', function() {
      let resAuthor;
      return chai.request(app)
        .get('/authors')
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body.authors).to.be.a('array');
          expect(res.body.authors).to.have.lengthOf.at.least(1);

          res.body.authors.forEach(function(author) {
            expect(author).to.be.a('object');
            expect(author).to.include.keys('_id', 'name', 'userName');
          });
          resAuthor = res.body.authors[0];
          return Author.findById(resAuthor._id);
        })
        .then(function(author) {
          const splitName = resAuthor.name.split(' ');
          expect(splitName[0]).to.be.equal(author.firstName);
          expect(splitName[1]).to.be.equal(author.lastName);
          expect(resAuthor._id).to.equal(author.id);
          expect(resAuthor.userName).to.equal(author.userName);
        });
    });
  });

  describe('POST authors endpoint', function() {
    it('should add an author to the authors collection', function() {
      const newAuthor = generateAuthorData();
      return chai.request(app)
        .post('/authors')
        .send(newAuthor)
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys('_id', 'name', 'userName');
          expect(res.body.id).to.not.be.null;
          return Author.findById(res.body._id);
        })
        .then(function(author) {
          expect(author.firstName).to.be.equal(newAuthor.firstName);
          expect(author.lastName).to.be.equal(newAuthor.lastName);
          expect(author.userName).to.equal(newAuthor.userName);
        });
    });
  });

  describe('PUT authors endpoint', function() {
    it('should update valid fields for an author by author id', function() {
      const updateData = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        userName: gernerateUserName()
      };
      return Author
        .findOne()
        .then(function(author) {
          updateData.id = author._id;
          return chai.request(app)
            .put(`/authors/${author._id}`)
            .send(updateData);
        })
        .then(function(res) {          
          // expect(res).to.have.status(204);
          expect(res).to.have.status(200);
          return Author.findById(updateData.id);
        })
        .then(function(author) {
          expect(author.firstName).to.equal(updateData.firstName);
          expect(author.lastName).to.equal(updateData.lastName);
          expect(author.userName).to.equal(updateData.userName);
        });
    });
  });

  describe('DELETE authors endpoint', function() {
    it('should delete author and all associated blogs by author id', function() {
      let author;
      return Author
        .findOne()
        .then(function(_author) {
          author = _author;
          return chai.request(app).delete(`/authors/${author._id}`);
        })
        .then(function(res) {
          expect(res).to.have.status(204);
          return Author.findById(author._id);
        })
        .then(function(_author) {
          expect(_author).to.be.null;
        });
    });
  });

  describe('GET blogs endpoint', function() {
    it('should return all blogs', function() {
      let res;
      return chai.request(app)
        .get('/posts')
        .then(function(_res) {
          res = _res;
          expect(res).to.have.status(200);
          expect(res.body.blogs).to.have.lengthOf.at.least(1);
          return Blog.count();
        })
        .then(function(count) {
          expect(res.body.blogs).to.have.lengthOf(count);
        });
    });
    it('should return blogs with correct fields', function() {
      let resBlog;
      return chai.request(app)
        .get('/posts')
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body.blogs).to.be.a('array');
          expect(res.body.blogs).to.have.lengthOf.at.least(1);

          res.body.blogs.forEach(function(blog) {
            expect(blog).to.be.a('object');
            expect(blog).to.include.keys('_id', 'title', 'author', 'content');
          });
          resBlog = res.body.blogs[0];
          return Blog.findById(resBlog._id);
        })
        .then(function(blog) {
          const splitName = resBlog.author.split(' ');
          expect(resBlog._id).to.equal(blog.id);
          expect(resBlog.title).to.equal(blog.title);
          expect(splitName[0]).to.equal(blog.author.firstName);
          expect(splitName[1]).to.equal(blog.author.lastName);
          expect(resBlog.content).to.equal(blog.content);
          // console.log('RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR resBlog.comments', resBlog.comments);
          // console.log('BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB blog.comments', blog.comments);
          // expect(resBlog.comments).to.equal(blog.comments);
        });
    });
  });

  describe('GET blogs by id endpoint', function() {
    it('should get a single blog by blog id', function() {
      let blog;
      return Blog
        .findOne()
        .then(function(_blog) {
          blog = _blog;
          return chai.request(app).get(`/posts/${_blog._id}`);
        })
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys('_id', 'title', 'author', 'content', 'comments');
          return Blog.findById(blog._id);
        })
        .then(function(resBlog) {
          expect(resBlog.title).to.equal(blog.title);
          expect(resBlog.author.firstName).to.equal(blog.author.firstName);
          expect(resBlog.author.lastName).to.equal(blog.author.lastName);
          expect(resBlog.content).to.equal(blog.content);
          // console.log('RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR resBlog.comments', resBlog.comments);
          // console.log('BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB blog.comments', blog.comments);
          // expect(resBlog.comments).to.equal(blog.comments);
        });
    });
  });

  describe('POST blogs endpoint', function() {
    it('should add a blog by author id', function() {
      let newBlog;
      return Author
        .findOne()
        .then(function(author) {
          newBlog = {
            author_id: author._id,
            title: faker.lorem.sentence(),
            content: faker.lorem.paragraph()
          };
          return chai.request(app)
            .post('/posts')
            .send(newBlog)
            .then(function(res) {
              expect(res).to.have.status(201);
              expect(res).to.be.json;
              expect(res.body).to.be.a('object');
              expect(res.body).to.include.keys('_id', 'title', 'author', 'content', 'comments');
              expect(res.body._id).to.not.be.null;
              return Blog.findById(res.body._id);
            })
            .then(function(blog) {
              expect(blog.title).to.equal(newBlog.title);
              expect(blog.author_id).to.equal(newBlog._id);
              expect(blog.content).to.equal(newBlog.content);
            });
        });     
    });
  });

  describe('PUT blogs endpoint', function() {
    it('should update valid fields for a blog by blog id', function() {
      const updateData = {
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraph()
      };
      return Blog
        .findOne()
        .then(function(blog) {
          updateData.id = blog._id;
          return chai.request(app)
            .put(`/posts/${blog._id}`)
            .send(updateData);
        })
        .then(function(res) {
          // expect(res).to.have.status(204);
          expect(res).to.have.status(200);
          return Blog.findById(updateData.id);
        })
        .then(function(blog) {
          expect(blog.title).to.equal(updateData.title);
          expect(blog.content).to.equal(updateData.content);
        });
    });
  });
  
  describe('DELETE blogs endpoint', function() {
    it('should delete a single blog by blog id', function() {
      let blog;
      return Blog
        .findOne()
        .then(function(_blog) {
          blog = _blog;
          return chai.request(app).delete(`/posts/${blog._id}`);
        })
        .then(function(res) {
          expect(res).to.have.status(204);
          return Blog.findById(blog._id);
        })
        .then(function(_blog) {
          expect(_blog).to.be.null;
        });
    });
  });
});
