process.env.NODE_ENV = 'test';

const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');

const request = supertest(app);
const connection = require('../db/connection');

describe('/api', () => {
  beforeEach(() => connection.migrate.rollback()
    .then(() => connection.migrate.latest())
    .then(() => connection.seed.run()));
  after(() => connection.destroy());

  it('Error - responds with status 404 if the client enters an endpoint that does not exist', () => request.get('/api/nonexistent')
    .expect(404)
    .then((res) => {
      expect(res.body.message).to.eql('Page not found');
    }));
  describe('/topics', () => {
    it('GET - responds with status 200 and an array of topic object', () => request
      .get('/api/topics')
      .expect(200)
      .then((res) => {
        expect(res.body.topics[0]).to.have.keys(['slug', 'description']);
        expect(res.body.topics[0].slug).to.eql('mitch');
      }));
    it('POST - responds with status 201 and the added topic object', () => {
      const newTopic = {
        description: 'The punniest reasons to be alive',
        slug: 'Puns',
      };
      return request.post('/api/topics')
        .send(newTopic)
        .expect(201)
        .then((res) => {
          expect(res.body.topic).to.have.length(1);
          expect(res.body.topic[0]).to.eql({
            description: 'The punniest reasons to be alive',
            slug: 'Puns',
          });
        });
    });
    it('ERROR - responds with 422 if client enters non-unique slug', () => {
      const newTopic = {
        description: 'The only actual reason to be alive',
        slug: 'cats',
      };
      return request.post('/api/topics')
        .send(newTopic)
        .expect(422)
        .then((res) => {
          expect(res.body.message).to.equal('This key already exists');
        });
    });
    describe('/:topics/articles', () => {
      it('GET - responds with 200 and an array of article objects for the chosen topic with default values for limit, sort_by and order', () => request.get('/api/topics/mitch/articles')
        .expect(200)
        .then((res) => {
          expect(res.body.articles[0].topic).to.eql('mitch');
          expect(res.body.articles[0]).to.have.keys('article_id', 'title', 'author', 'votes', 'created_at', 'topic', 'comment_count');
          expect(res.body.articles).to.have.length(10);
          expect(res.body.articles[0].article_id).to.equal(1);
        }));
      it('GET - responds with 200 and an array of article objects, with limit applied by client in query', () => request.get('/api/topics/mitch/articles?limit=3')
        .expect(200)
        .then((res) => {
          expect(res.body.articles).to.have.length(3);
        }));
      it('GET - responds with 200 and an array of article objects, sort applied by client in query', () => request.get('/api/topics/mitch/articles?sort_by=article_id')
        .expect(200)
        .then((res) => {
          expect(res.body.articles[0].article_id).to.equal(12);
        }));
      it('GET - responds with 200 and an array of article objects, starting at page specified in query', () => request.get('/api/topics/mitch/articles?p=2&limit=2')
        .expect(200)
        .then((res) => {
          expect(res.body.articles[0].article_id).to.equal(3);
        }));
      it('GET - responds with 200 and an array of article objects, sorted to ascending if specified in query', () => request.get('/api/topics/mitch/articles?sort_ascending=true')
        .expect(200)
        .then((res) => {
          expect(res.body.articles[0].article_id).to.equal(1);
        }));
    });
  });
});
