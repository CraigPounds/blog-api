'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const { app, runServer, closeServer } = require('../server');

chai.use(chaiHttp);

describe('Blogs', function() {
  before(function() {
    runServer();
  });
  after(function() {
    closeServer();
  });
  it('should list blogs on GET', function() {
    return chai
      .request(app)
      .get('/blog-posts')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body.length).to.be.at.least(1);
        const expectedKeys = ['id', 'title', 'content', 'author', 'publishDate'];
        res.body.forEach(function(blog) {
          expect(blog).to.be.a('object');
          expect(blog).to.include.keys(expectedKeys);
        });
      });
  });
  it('should add a blog on POST', function() {
    const newBlog = { title: 'AI & Programming', content: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vero fugit voluptatibus ipsam distinctio eius asperiores ab enim tempore ea vitae. Quo reprehenderit, officiis sed ipsa illo ipsum nobis voluptatibus repellendus?', author: 'Visual Studio Code' };
    return chai
      .request(app)
      .post('/blog-posts')
      .send(newBlog)
      .then(function(res) {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('id', 'title', 'content', 'author');
        expect(res.body.id).to.not.equal(null);
        expect(res.body).to.deep.equal(
          Object.assign(newBlog, { id: res.body.id })
        );
      });
  });
  // it('should update blog on PUT', function() {
  
  // });
  // it('should delete blog on DELETE', function() {
  
  // });
});
