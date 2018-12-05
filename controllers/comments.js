const connection = require('../db/connection');

exports.getAllComments = (req, res, next) => {
  const { article_id } = req.params;
  return connection('comments')
    .select('comment_id', 'votes', 'created_at', 'body', 'username AS author')
    .where('article_id', article_id)
    .join('users', 'comments.user_id', '=', 'users.user_id')
    .then((comments) => {
      if (comments.length === 0) return Promise.reject({ status: 404, message: 'Page not found' });
      return res.status(200).send({ comments });
    })
    .catch(next);
};
