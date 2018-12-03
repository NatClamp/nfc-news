const {
  topicData,
  userData,
  articleData,
  commentData,
} = require('../data/test-data');
const {
  userLookup, formatArticles, articleLookup, formatComments,
} = require('../utils/utils');

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
      const userLookObj = userLookup(usersRows);
      const formattedArticles = formatArticles(articleData, userLookObj);
      return knex('articles').insert(formattedArticles).returning('*');
    })
    .then((articlesRows) => {
      const articleLookupObj = articleLookup(articlesRows);
      const formattedComments = formatComments(commentData, articleLookupObj);
      console.log(formattedComments);
      return knex('comments')
        .insert(formattedComments)
        .returning('*');
    })
    .then((commentRows) => {
      console.log(commentRows);
    });
};
