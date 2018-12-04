const connection = require('../db/connection');

exports.getAllTopics = (req, res, next) => {
  connection('topics')
    .select('*')
    .then(topics => res.status(200).send({ topics }))
    .catch(next);
};

exports.addATopic = (req, res, next) => {
  connection('topics')
    .insert(req.body)
    .returning('*')
    .then(topic => res.status(201).send({ topic }))
    .catch(next);
};

exports.getArticlesWithTopic = (req, res, next) => {
  const { topic } = (req.params);
  const {
    limit = 10, sort_by = 'created_at', p = 1, sort_ascending,
  } = req.query;
  return connection('articles')
    .select('articles.article_id', 'title', 'username AS author', 'articles.votes', 'articles.created_at', 'articles.topic')
    .limit(limit)
    .offset((p - 1) * limit)
    .orderBy(sort_by, 'desc')
    .where('topic', topic)
    .join('users', 'created_by', '=', 'users.user_id')
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .count('comments.article_id AS comment_count')
    .groupBy('articles.article_id', 'users.username')
    .modify((articleQuery) => {
      if (sort_ascending) articleQuery.orderBy(sort_by, 'asc');
    })
    .then((articles) => {
      if (articles.length === 0) return Promise.reject({ status: 404, message: 'Page not found' });
      return res.status(200).send({ articles });
    })
    .catch(next);
};
