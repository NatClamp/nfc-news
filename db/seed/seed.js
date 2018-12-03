const {
  topicData,
  userData,
  articleData,
  commentData,
} = require('../data/test-data');
const { formattedArticles } = require('../utils/utils');

exports.seed = function (knex, Promise) {
  return Promise.all([
    knex('topics').del(),
    knex('users').del(),
    knex('articles').del(),
    knex('comments').del(),
  ])
    .then(() => knex('topics')
      .insert(topicData)
      .returning('*'))
    .then(topicRows => knex('users')
      .insert(userData)
      .returning('*'))
    .then((usersRows) => {
      const formattedArticleData = formattedArticles();
      console.log(formattedArticleData);
      return knex('articles').insert(formattedArticleData).returning('*');
    })
    .then(articlesRows => knex('comments')
      .insert(commentData)
      .returns('*'))
    .then((commentRows) => {
      console.log(commentRows);
    });
};
