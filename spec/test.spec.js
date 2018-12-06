process.env.NODE_ENV = 'test';

const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');

const request = supertest(app);
const connection = require('../db/connection');

describe('/*', () => {
  beforeEach(() => connection.migrate.rollback()
    .then(() => connection.migrate.latest())
    .then(() => connection.seed.run()));
  after(() => connection.destroy());
  it('ERROR - responds with status 404 if client enters endpoint that doesn\'t exist', () => request.get('/nonexistent')
    .expect(404)
    .then((res) => {
      expect(res.body.message).to.equal('Page not found');
    }));
  describe('/api', () => {
    it('Error - responds with status 404 if the client enters an endpoint that does not exist within api', () => request.get('/api/nonexistent')
      .expect(404)
      .then((res) => {
        expect(res.body.message).to.eql('Page not found');
      }));
    it.only('GET - responds with 200 and serves a JSON describing all the available endpoints on the API', () => request
      .get('/api')
      .expect(200)
      .then((res) => {
        expect(Object.keys(res.body.endpoints)).to.have.length(9);
      }));
    describe('/topics', () => {
      it('GET - responds with status 200 and an array of topic objects', () => request
        .get('/api/topics')
        .expect(200)
        .then((res) => {
          expect(res.body.topics[0]).to.have.keys(['slug', 'description']);
          expect(res.body.topics[0].slug).to.eql('mitch');
        }));
      it('POST - responds with status 201 and the added topic object', () => {
        const newTopic = {
          description: 'The punniest reasons to be alive',
          slug: 'puns',
        };
        return request.post('/api/topics')
          .send(newTopic)
          .expect(201)
          .then((res) => {
            expect(res.body.topic).to.have.length(1);
            expect(res.body.topic[0]).to.eql({
              description: 'The punniest reasons to be alive',
              slug: 'puns',
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
      it('ERROR - responds with 405 if client uses a method not specified', () => {
        const deleteTopic = {
          description: 'Not dogs',
          slug: 'cats',
        };
        return request
          .delete('/api/topics')
          .send(deleteTopic)
          .expect(405)
          .then((res) => {
            expect(res.body.message).to.equal('METHOD NOT ALLOWED');
          });
      });
      it('ERROR - responds with 400 when client enters incorrectly formatted body', () => {
        const sillyTopic = {
          hello: 'you',
          how_are_you: 'very sad',
        };
        return request
          .post('/api/topics')
          .send(sillyTopic)
          .expect(400)
          .then((res) => {
            expect(res.body.message).to.equal('Invalid format');
          });
      });
      describe('/:topics/articles', () => {
        it('GET - responds with 200 and an array of article objects for the chosen topic with default values for limit, sort_by and order', () => request
          .get('/api/topics/mitch/articles')
          .expect(200)
          .then((res) => {
            expect(res.body.articles[0].topic).to.eql('mitch');
            expect(res.body.articles[0]).to.have.keys('article_id', 'title', 'author', 'votes', 'created_at', 'topic', 'comment_count');
            expect(res.body.articles).to.have.length(10);
            expect(res.body.articles[0].article_id).to.equal(1);
          }));
        it('ERROR - responds with status 404 if client enters topic that does not exist', () => request
          .get('/api/topics/puppies/articles')
          .expect(404)
          .then((res) => {
            expect(res.body.message).to.equal('Page not found');
          }));
        it('ERROR - responds with 405 and message if client tries to use inaccessible method', () => request.patch('/api/topics/mitch/articles')
          .expect(405)
          .then((res) => {
            expect(res.body.message).to.equal('METHOD NOT ALLOWED');
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
        it('ERROR - responds with 400 if the client incorrectly enters a query', () => request.get('/api/topics/mitch/articles?sort_by=jdhaffb')
          .expect(400)
          .then((res) => {
            expect(res.body.message).to.equal('Invalid format');
          }));
        it('POST - responds with 201 and the posted article', () => {
          const newArticle = {
            title: 'toot toot',
            user_id: 2,
            body: 'Every day coding is like experience an entire life in 24 hours',
          };
          return request.post('/api/topics/mitch/articles')
            .send(newArticle)
            .expect(201)
            .then((res) => {
              expect(res.body.article).to.have.length(1);
              expect(res.body.article[0].title).to.equal('toot toot');
              expect(res.body.article[0]).to.have.all.keys(['article_id', 'title', 'body', 'votes', 'topic', 'created_by', 'created_at']);
            });
        });
        it('ERROR - responds with 422 if the client provides a user_id that doesn\'t exist', () => {
          const newArticle = {
            title: 'toot toot',
            user_id: 799,
            body: 'Every day coding is like experience an entire life in 24 hours',
          };
          return request.post('/api/topics/mitch/articles')
            .send(newArticle)
            .expect(422)
            .then((res) => {
              expect(res.body.message).to.equal('violates foreign key constraint');
            });
        });
        it('ERROR - responds with 400 if the client provides malformed syntax e.g. a missing key', () => {
          const newArticle = {
            user_id: 2,
            body: 'Every day coding is like experience an entire life in 24 hours',
          };
          return request.post('/api/topics/mitch/articles')
            .send(newArticle)
            .expect(400)
            .then((res) => {
              expect(res.body.message).to.equal('missing value violates not-null constraint');
            });
        });
      });
    });
    describe('/articles', () => {
      it('GET - responds with status 200 and an array of article objects with default values for limit, sort_by and order', () => request.get('/api/articles')
        .expect(200)
        .then((res) => {
          expect(res.body.articles[0]).to.have.all.keys(['article_id', 'title', 'votes', 'topic', 'author', 'created_at', 'comment_count']);
          expect(res.body.articles).to.have.length(10);
          expect(res.body.articles[0].article_id).to.equal(1);
        }));
      it('GET - responds with 200 and an array of article objects, with limit applied by client in query', () => request.get('/api/articles?limit=3')
        .expect(200)
        .then((res) => {
          expect(res.body.articles).to.have.length(3);
        }));
      it('GET - responds with 200 and an array of article objects, sort applied by client in query', () => request.get('/api/articles?sort_by=article_id')
        .expect(200)
        .then((res) => {
          expect(res.body.articles[0].article_id).to.equal(12);
        }));
      it('GET - responds with 200 and an array of article objects, starting at page specified in query', () => request.get('/api/articles?p=2&limit=2')
        .expect(200)
        .then((res) => {
          expect(res.body.articles[0].article_id).to.equal(3);
        }));
      it('GET - responds with 200 and an array of article objects, sorted to ascending if specified in query', () => request.get('/api/articles?sort_ascending=true')
        .expect(200)
        .then((res) => {
          expect(res.body.articles[0].article_id).to.equal(1);
        }));
      it('ERROR - responds with 400 if the client incorrectly enters a query', () => request.get('/api/articles?sort_by=jdhaffb')
        .expect(400)
        .then((res) => {
          expect(res.body.message).to.equal('Invalid format');
        }));
      describe('/:article_id', () => {
        it('GET - responds with 200 and an article object', () => request.get('/api/articles/4')
          .expect(200)
          .then((res) => {
            expect(res.body.article[0].article_id).to.equal(4);
          }));
        it('ERROR - responds with 400 if client enters article_id of wrong data type', () => request.get('/api/articles/hydrangea')
          .expect(400)
          .then((res) => {
            expect(res.body.message).to.equal('invalid input syntax for integer');
          }));
        it('ERROR - responds with 404 if client enters article_id that does not exist', () => request.get('/api/articles/967')
          .expect(404)
          .then((res) => {
            expect(res.body.message).to.equal('Page not found');
          }));
        it('PATCH - responds with 200 and upates the value on the votes key with a positive number', () => {
          const vote = { inc_votes: 5 };
          return request.patch('/api/articles/3')
            .send(vote)
            .expect(200)
            .then((res) => {
              expect(res.body.article[0].votes).to.equal(5);
            });
        });
        it('PATCH - responds with 200 and upates the value on the votes key with a negative number', () => {
          const vote = { inc_votes: -5 };
          return request.patch('/api/articles/3')
            .send(vote)
            .expect(200)
            .then((res) => {
              expect(res.body.article[0].votes).to.equal(-5);
            });
        });
        it('ERROR - responds with status 400 if client tries to update votes with an incorrect data type', () => {
          const vote = { inc_votes: 'KUDOS' };
          return request.patch('/api/articles/3')
            .send(vote)
            .expect(400)
            .then((res) => {
              expect(res.body.message).to.equal('invalid input syntax for integer');
            });
        });
        it('DELETE - returns status 204 and returns and empty object', () => request
          .delete('/api/articles/1')
          .expect(204)
          .then((res) => {
            expect(res.body).to.eql({});
          })
          .then(() => request
            .get('/api/articles/1')
            .expect(404))
          .then((res) => {
            expect(res.body.message).to.equal('Page not found');
          }));
        it('ERROR - responds with a 404 if client tries to delete an article that does not exist', () => request.delete('/api/articles/58371')
          .expect(404)
          .then((res) => {
            expect(res.body.message).to.equal('Page not found');
          }));
        describe('/comments', () => {
          it('GET - returns status 200 and an array of comments with default queries', () => request
            .get('/api/articles/1/comments')
            .expect(200)
            .then((res) => {
              expect(res.body.comments).to.have.length(10);
              expect(res.body.comments[0].comment_id).to.equal(2);
            }));
          it('ERROR - returns 404 if client enters an article number for an existing article that does not have any comments', () => request
            .get('/api/articles/8/comments')
            .expect(404)
            .then((res) => {
              expect(res.body.message).to.equal('Page not found');
            }));
          it('ERROR - returns 400 if client enters an invalid article_id', () => request
            .get('/api/articles/error/comments')
            .expect(400)
            .then((res) => {
              expect(res.body.message).to.equal('invalid input syntax for integer');
            }));
          it('GET - returns status 200 and applies limit query if client provides one', () => request.get('/api/articles/1/comments?limit=2')
            .expect(200)
            .then((res) => {
              expect(res.body.comments).to.have.length(2);
            }));
          it('GET - returns status 200 and applies sort_by query if client provides one', () => request.get('/api/articles/1/comments?sort_by=votes')
            .expect(200)
            .then((res) => {
              expect(res.body.comments[0].author).to.eql('icellusedkars');
              expect(res.body.comments[2].comment_id).to.eql(2);
            }));
          it('GET - returns status 200 and applies page query if client provides one', () => request.get('/api/articles/1/comments?p=2&limit=2')
            .expect(200)
            .then((res) => {
              expect(res.body.comments[0].comment_id).to.eql(4);
              expect(res.body.comments).to.have.length(2);
            }));
          it('GET - returns status 200 and applies ordering if client provides one', () => request.get('/api/articles/1/comments?sort_by=comment_id&sort_ascending=true')
            .expect(200)
            .then((res) => {
              expect(res.body.comments[0].comment_id).to.eql(2);
            }));
          it('ERROR - responds with 400 if the client incorrectly enters a query', () => request.get('/api/articles/1/comments?sort_by=jdhaffb')
            .expect(400)
            .then((res) => {
              expect(res.body.message).to.equal('Invalid format');
            }));
          it('POST - responds with 201 and the posted object with user_id and body', () => {
            const newComment = { user_id: 1, body: 'What lovely bunting!' };
            return request
              .post('/api/articles/1/comments')
              .send(newComment)
              .expect(201)
              .then((res) => {
                expect(res.body.comment).to.have.length(1);
                expect(res.body.comment[0].body).to.eql('What lovely bunting!');
              });
          });
          it('ERROR - responds with 400 if client enters comment with a missing key', () => {
            const newComment = { user_id: 1 };
            return request
              .post('/api/articles/1/comments')
              .send(newComment)
              .expect(400)
              .then((res) => {
                expect(res.body.message).to.equal('missing value violates not-null constraint');
              });
          });
          it('ERROR - responds with 422 if client enters a user_id that doesn\'t exist', () => {
            const newComment = { user_id: 987, body: 'Were Shibes doing all these funny things before people started taking photos and posting them online?' };
            return request
              .post('/api/articles/1/comments')
              .send(newComment)
              .expect(422)
              .then((res) => {
                expect(res.body.message).to.equal('violates foreign key constraint');
              });
          });
          describe('/:comment_id', () => {
            it('PATCH - responds with 200 and updates the votes on a comment with a positive number', () => {
              const newVote = { inc_votes: 5 };
              return request
                .patch('/api/articles/1/comments/2')
                .send(newVote)
                .expect(200)
                .then((res) => {
                  expect(res.body.comment).to.have.length(1);
                  expect(res.body.comment[0].votes).to.equal(19);
                });
            });
            it('PATCH - responds with 200 and updates the votes on a comment with a negative number', () => {
              const newVote = { inc_votes: -5 };
              return request
                .patch('/api/articles/1/comments/2')
                .send(newVote)
                .expect(200)
                .then((res) => {
                  expect(res.body.comment).to.have.length(1);
                  expect(res.body.comment[0].votes).to.equal(9);
                });
            });
            it('ERROR - PATCH - reponds with 400 if client tries to update vote with an incorrect data type', () => {
              const newVote = { inc_votes: 'i like this one' };
              return request
                .patch('/api/articles/1/comments/2')
                .send(newVote)
                .expect(400)
                .then((res) => {
                  expect(res.body.message).to.equal('invalid input syntax for integer');
                });
            });
            it('DELETE - returns status 204 and returns and empty object', () => request
              .delete('/api/articles/1/comments/2')
              .expect(204)
              .then((res) => {
                expect(res.body).to.eql({});
              })
              .then(() => request
                .get('/api/articles/1/comments/2')
                .expect(404))
              .then((res) => {
                expect(res.body.message).to.equal('Page not found');
              }));
            it('ERROR - DELETE - responds with a 404 if client tries to delete an comment that does not exist', () => request.delete('/api/articles/1/comments/235')
              .expect(404)
              .then((res) => {
                expect(res.body.message).to.equal('Page not found');
              }));
          });
        });
      });
    });
    describe('/users', () => {
      it('GET - returns 200 and an array of user objects', () => request
        .get('/api/users')
        .expect(200)
        .then((res) => {
          expect(res.body.users).to.have.length(3);
          expect(res.body.users[0].name).to.equal('jonny');
          expect(res.body.users[0]).to.have.all.keys(['user_id', 'username', 'avatar_url', 'name']);
        }));
      describe('/:user_id', () => {
        it('GET - responds with 200 and a user object', () => request.get('/api/users/1')
          .expect(200)
          .then((res) => {
            expect(res.body.user).to.have.length(1);
            expect(res.body.user[0]).to.have.all.keys(['user_id', 'username', 'avatar_url', 'name']);
          }));
      });
    });
  });
});

// non existent id - 422
// syntax wrong - 400
