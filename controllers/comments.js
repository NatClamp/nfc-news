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
