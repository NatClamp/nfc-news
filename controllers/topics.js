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
    .select('article_id', 'title', 'username AS author', 'votes', 'created_at', 'topic')
    .join('users', 'created_by', '=', 'users.user_id')
    .where('topic', topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
