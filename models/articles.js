const connection = require('../db/connection');

exports.getArticles = (req, res, next) => {
  if (Number.isInteger(+req.params.topic)) return next({ code: 42703 });
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
    .modify((articleQuery) => {
      if (req.params.topic) articleQuery.where('topic', req.params.topic);
      else if (req.params.article_id) articleQuery.where('articles.article_id', req.params.article_id);
    })
    .then((articles) => {
      if (articles.length === 0) return Promise.reject({ status: 404, message: 'Page not found' });
      return res.status(200).send({ articles });
    })
    .catch(next);
};
