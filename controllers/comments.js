const connection = require('../db/connection');

exports.getAllComments = (req, res, next) => {
  const {
    limit = 10, sort_by = 'created_at', p = 1, sort_ascending,
  } = req.query;
  const { article_id } = req.params;
  const sorting = sort_ascending ? 'asc' : 'desc';
  return connection('comments')
    .select('comment_id', 'votes', 'created_at', 'body', 'username AS author')
    .where('article_id', article_id)
    .limit(limit)
    .offset(limit * (p - 1))
    .orderBy(sort_by, sorting)
    .join('users', 'comments.user_id', '=', 'users.user_id')
    .then((comments) => {
      if (comments.length === 0) return Promise.reject({ status: 404, message: 'Page not found' });
      return res.status(200).send({ comments });
    })
    .catch(next);
};

exports.addComment = (req, res, next) => {
  if (!req.body.body || !req.body.user_id) return next({ status: 400, code: 23502, message: 'missing value violates not-null constraint' });
  const { article_id } = req.params;
  const commentToAdd = { ...req.body, article_id };
  return connection('comments')
    .insert(commentToAdd)
    .returning('*')
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
