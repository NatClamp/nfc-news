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
  return connection('articles')
    .select('articles.article_id', 'title', 'username AS author', 'articles.votes', 'articles.created_at', 'articles.topic')
    .where('topic', topic)
    .join('users', 'created_by', '=', 'users.user_id')
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .count('comments.article_id AS comment_count')
    .groupBy('articles.article_id', 'users.username')
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
