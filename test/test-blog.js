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
    const newBlog = { title: 'AI & Programming', content: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit?', author: 'Visual Studio Code', publishDate: 1534473154606 };
    return chai
      .request(app)
      .post('/blog-posts')
      .send(newBlog)
      .then(function(res) {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('id', 'title', 'content', 'author', 'publishDate');
        expect(res.body.id).to.not.equal(null);
        expect(res.body).to.deep.equal(
          Object.assign(newBlog, { id: res.body.id })
        );
      });
  });
  it('should update blog on PUT', function() {
    const updateData = {
      title: 'More and More AI',
      content: 'Shut up human!',
      author: 'Servotron'
    };
    return (
      chai
        .request(app)
        .get('/blog-posts')
        .then(function(res) {
          updateData.id = res.body[0].id;
          return chai
            .request(app)
            .put(`/blog-posts/${updateData.id}`)
            .send(updateData);
        })
        .then(function(res) {
          expect(res).to.have.status(204);
        })
    );
  });
  it('should delete blog on DELETE', function() {
    return (
      chai
        .request(app)
        .get('/blog-posts')
        .then(function(res) {
          return chai.request(app).delete(`/blog-posts/${res.body[0].id}`);
        })
        .then(function(res) {
          expect(res).to.have.status(204);
        })
    );
  });
});
