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

function seedAuthorData() {
  console.info('seeding author data');
  const seedData = [];

  for (let i = 1; i <= 10; i++) {
    seedData.push(generateAuthorData());
  }
  // console.log(seedData);
  return Author.insertMany(seedData);
}

function generateAuthorData() {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    userName: gernerateUserName()
  };
}

function gernerateUserName() {
  return `${faker.name.firstName()} ${faker.name.lastName()}`;
}

function generateBlogData() {
  return {
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraph()    
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
    return seedAuthorData();
  });
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
            expect(author).to.include.keys('id', 'name', 'userName');
          });
          resAuthor = res.body.authors[0];
          // console.log('resAuthor', resAuthor);
          return Author.findById(resAuthor.id);
        })
        .then(function(author) {
          // console.log('author', author);
          expect(resAuthor.id).to.equal(author.id);
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
          // console.log('res.body', res.body);
          expect(res.body.id).to.not.be.null;
          return Author.findById(res.body.id);
        })
        .then(function(author) {
          expect(author.userName).to.equal(newAuthor.userName);
        });
    });
  });

  // describe('PUT authors endpoint', function() {
  //   it('should update valid fields for an author by author id', function() {

  //   });
  // });

  // describe('DELETE authors endpoint', function() {
  //   it('should delete author and all associated blogs by author id', function() {

  //   });
  // });

  // describe('GET blogs endpoint', function() {
  //   it('should get all blogs', function() {

  //   });
  // });

  // describe('GET blogs by id endpoint', function() {
  //   it('should get a single blog by blog id', function() {

  //   });
  // });

  // describe('POST blogs endpoint', function() {
  //   it('should add a blog for by author id', function() {

  //   });
  // });

  // describe('PUT blogs endpoint', function() {
  //   it('should update valid fields for a blog by blog id', function() {

  //   });
  // });
  
  // describe('DELETE blogs endpoint', function() {
  //   it('should delete a single blog by blog id', function() {

  //   });
  // });
});
