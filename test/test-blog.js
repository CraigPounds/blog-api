'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const faker = require('faker');
const mongoose = require('mongoose');
const { Authors, Blog } = require('../models');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');

chai.use(chaiHttp);

function seedData() {
  console.log('seeding data');
  
}

function generateAuthorData() {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    userName: `${faker.name.firstName()} ${faker.name.lastName()}`
  };
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
    return seedData();
  });
  afterEach(function() {
    return tearDownDb();
  });
  after(function() {
    return closeServer();
  });  
  describe('GET authors endpoint', function() {
    let res;
    it('should return all authors', function() {
      return chai.request(app)
        .get('/authors')
        .then(function(_res) {
          res = _res;
          expect(res).to.have.status(200);
          expect(res.body.authors).to.have.lengthOf.at.least(1);
          return Authors.count();
        })
        .then(function(count) {
          expect(res.body.authors).to.have.lengthOf(count);
        });
    });
    
  });
  // describe('POST authors endpoint', function() {
  //   it('should add an author to the authors collection', function() {

  //   });
  // });
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




















// describe('blog-api resorces', function() {
//   before(function() {
//     runServer();
//   });
//   after(function() {
//     closeServer();
//   });
//   it('should list blogs on GET', function() {
//     return chai
//       .request(app)
//       .get('/blog-posts')
//       .then(function(res) {
//         expect(res).to.have.status(200);
//         expect(res).to.be.json;
//         expect(res.body).to.be.a('array');
//         expect(res.body.length).to.be.at.least(1);
//         const expectedKeys = ['id', 'title', 'content', 'author', 'publishDate'];
//         res.body.forEach(function(blog) { 
//           expect(blog).to.be.a('object');
//           expect(blog).to.include.keys(expectedKeys);
//         });
//       });
//   });
//   it('should add a blog on POST', function() {
//     const newBlog = { title: 'AI & Programming', content: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit?', author: 'Visual Studio Code', publishDate: 1534473154606 };
//     return chai
//       .request(app)
//       .post('/blog-posts')
//       .send(newBlog)
//       .then(function(res) {
//         expect(res).to.have.status(201);
//         expect(res).to.be.json;
//         expect(res.body).to.be.a('object');
//         expect(res.body).to.include.keys('id', 'title', 'content', 'author', 'publishDate');
//         expect(res.body.id).to.not.equal(null);
//         expect(res.body).to.deep.equal(
//           Object.assign(newBlog, { id: res.body.id })
//         );
//       });
//   });
//   it('should update blog on PUT', function() {
//     const updateData = {
//       title: 'More and More AI',
//       content: 'Shut up human!',
//       author: 'Servotron'
//     };
//     return (
//       chai
//         .request(app)
//         .get('/blog-posts')
//         .then(function(res) {
//           updateData.id = res.body[0].id;
//           return chai
//             .request(app)
//             .put(`/blog-posts/${updateData.id}`)
//             .send(updateData);
//         })
//         .then(function(res) {
//           expect(res).to.have.status(204);
//         })
//     );
//   });
//   it('should delete blog on DELETE', function() {
//     return (
//       chai
//         .request(app)
//         .get('/blog-posts')
//         .then(function(res) {
//           return chai.request(app).delete(`/blog-posts/${res.body[0].id}`);
//         })
//         .then(function(res) {
//           expect(res).to.have.status(204);
//         })
//     );
//   });
// });
