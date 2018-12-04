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

  it('Error - responds with status 404 if the client enters an endpoint that does not exist', () => {
    request.get('/api/nonexistent')
      .expect(404)
      .then((res) => {
        expect(res.body.message).to.eql('Page not found');
      });
  });
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
  });
});
