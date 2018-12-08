const connection = require('../db/connection');
const { getArticles } = require('../models/articles');

exports.getArticlesController = (req, res, next) => {
  getArticles(req, res, next);
};

exports.addArticlesWithTopic = (req, res, next) => {
  if (!req.body.title || !req.body.user_id || !req.body.body) return next({ status: 400, code: 23502, message: 'missing value violates not-null constraint' });
  const copy = { ...req.body, ...req.params };
  return connection('articles')
    .insert(copy)
    .returning('*')
    .then((article) => {
      [article] = article;
      res.status(201).send({ article });
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
    .then((article) => {
      if (article.length === 0) return Promise.reject({ status: 404, message: 'Page not found' });
      [article] = article;
      return res.status(200).send({ article });
    })
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
