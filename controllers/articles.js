const connection = require('../db/connection');

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

exports.addArticlesWithTopic = (req, res, next) => {
  const copy = { ...req.body, ...req.params };
  copy.created_by = copy.user_id;
  const {
    title, created_by, body, topic,
  } = copy;
  const objToAdd = {
    title, created_by, body, topic,
  };
  return connection('articles')
    .insert(objToAdd)
    .returning('*')
    .then((article) => {
      if (Object.keys(article[0]).length !== 7) return Promise.reject({ status: 400, message: 'missing value violates not-null constraint' });
      return res.status(201).send({ article });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  const {
    limit = 10, sort_by = 'created_at', p = 1, sort_ascending,
  } = req.query;
  return connection('articles')
    .select('articles.article_id', 'title', 'username AS author', 'articles.votes', 'articles.created_at', 'articles.topic')
    .limit(limit)
    .offset((p - 1) * limit)
    .orderBy(sort_by, 'desc')
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

exports.getArticleByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const {
    limit = 10, sort_by = 'created_at', p = 1, sort_ascending,
  } = req.query;
  return connection('articles')
    .select('articles.article_id', 'title', 'username AS author', 'articles.votes', 'articles.created_at', 'articles.topic')
    .limit(limit)
    .offset((p - 1) * limit)
    .orderBy(sort_by, 'desc')
    .join('users', 'created_by', '=', 'users.user_id')
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .count('comments.article_id AS comment_count')
    .groupBy('articles.article_id', 'users.username')
    .where('articles.article_id', article_id)
    .modify((articleQuery) => {
      if (sort_ascending) articleQuery.orderBy(sort_by, 'asc');
    })
    .then((article) => {
      if (article.length === 0) return Promise.reject({ status: 404, message: 'Page not found' });
      return res.status(200).send({ article });
    })
    .catch(next);
};
