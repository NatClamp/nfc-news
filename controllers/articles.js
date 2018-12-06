const connection = require('../db/connection');

exports.getArticlesWithTopic = (req, res, next) => {
  const { topic } = (req.params);
  const {
    limit = 10, sort_by = 'created_at', p = 1, sort_ascending,
  } = req.query;
  const sorting = sort_ascending ? 'asc' : 'desc';
  return connection('articles')
    .select('articles.article_id', 'title', 'username AS author', 'articles.votes', 'articles.created_at', 'articles.topic')
    .limit(limit)
    .offset((p - 1) * limit)
    .orderBy(sort_by, sorting)
    .where('topic', topic)
    .join('users', 'articles.user_id', '=', 'users.user_id')
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .count('comments.article_id AS comment_count')
    .groupBy('articles.article_id', 'users.username')
    .then((articles) => {
      if (articles.length === 0) return Promise.reject({ status: 404, message: 'Page not found' });
      return res.status(200).send({ articles });
    })
    .catch(next);
};

exports.addArticlesWithTopic = (req, res, next) => {
  if (!req.body.title || !req.body.user_id || !req.body.body) return next({ status: 400, code: 23502, message: 'missing value violates not-null constraint' });
  const copy = { ...req.body, ...req.params };
  const {
    title, user_id, body, topic,
  } = copy;
  const objToAdd = {
    title, user_id, body, topic,
  };
  return connection('articles')
    .insert(objToAdd)
    .returning('*')
    .then(article => res.status(201).send({ article }))
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  const {
    limit = 10, sort_by = 'created_at', p = 1, sort_ascending,
  } = req.query;
  const sorting = sort_ascending ? 'asc' : 'desc';
  return connection('articles')
    .select('articles.article_id', 'title', 'username AS author', 'articles.votes', 'articles.created_at', 'articles.topic')
    .limit(limit)
    .offset((p - 1) * limit)
    .orderBy(sort_by, sorting)
    .join('users', 'articles.user_id', '=', 'users.user_id')
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .count('comments.article_id AS comment_count')
    .groupBy('articles.article_id', 'users.username')
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
    .join('users', 'articles.user_id', '=', 'users.user_id')
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

exports.updateArticleVote = (req, res, next) => {
  if (typeof req.body.inc_votes === 'string') return next({ code: '22P02' });
  const { inc_votes } = req.body;
  const { article_id } = req.params;
  return connection('articles')
    .select('*')
    .where('article_id', article_id)
    .modify((articleQuery) => {
      if (inc_votes > 0) articleQuery.increment('votes', inc_votes);
      else articleQuery.decrement('votes', Math.abs(inc_votes));
    })
    .returning('*')
    .then(article => res.status(200).send({ article }))
    .catch(next);
};

exports.deleteArticle = (req, res, next) => {
  const { article_id } = req.params;
  return connection('articles')
    .select('*')
    .where('article_id', article_id)
    .del()
    .returning('*')
    .then((article) => {
      if (article.length === 0) return Promise.reject({ status: 404, message: 'Page not found' });
      return res.status(204).send({});
    })
    .catch(next);
};
