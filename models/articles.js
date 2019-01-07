const connection = require('../db/connection');

exports.getArticles = (req, res, next) => {
  const { limit = 10, p = 1, sort_ascending } = req.query;
  if (Number.isInteger(+req.params.topic)) {return next({ code: 42703, message: 'Invalid format' });}
  if (!Number.isInteger(+limit) || !Number.isInteger(+p)) {return next({ code: '22P02', message: 'invalid input syntax for integer' });}
  if (+p < 0) {return next({ code: '2201X', message: 'OFFSET must not be negative' });}
  const validSorts = [
    'article_id',
    'title',
    'body',
    'votes',
    'topic',
    'user_id',
    'created_at',
  ];
  const sort_by = validSorts.includes(req.query.sort_by)
    ? req.query.sort_by
    : 'created_at';
  const sorting = sort_ascending ? 'asc' : 'desc';
  return connection('articles')
    .select(
      'articles.article_id',
      'title',
      'username AS author',
      'articles.votes',
      'articles.created_at',
      'articles.topic',
      'articles.body',
    )
    .limit(Math.abs(limit))
    .offset((p - 1) * limit)
    .orderBy(sort_by, sorting)
    .join('users', 'articles.user_id', '=', 'users.user_id')
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .count('comments.article_id AS comment_count')
    .groupBy('articles.article_id', 'users.username')
    .modify((articleQuery) => {
      if (req.params.topic) articleQuery.where('topic', req.params.topic);
      else if (req.params.article_id) {articleQuery.where('articles.article_id', req.params.article_id);}
    })
    .then((articles) => {
      if (articles.length === 0) {return Promise.reject({ status: 404, message: 'Page not found' });}
      if (articles.length === 1) [articles] = articles;
      return res.status(200).send({ articles });
    })
    .catch(next);
};
