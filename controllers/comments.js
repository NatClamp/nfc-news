const connection = require('../db/connection');

exports.getAllComments = (req, res, next) => {
  const {
    limit = 10, sort_by = 'created_at', p = 1, sort_ascending,
  } = req.query;
  const { article_id } = req.params;
  if (!Number.isInteger(+limit) || !Number.isInteger(+p)) return next({ code: '22P02' });
  if (+p < 0) return next({ code: '2201X' });
  const sorting = sort_ascending ? 'asc' : 'desc';
  return connection('comments')
    .select('comment_id', 'votes', 'created_at', 'body', 'username AS author')
    .where('article_id', article_id)
    .limit(Math.abs(limit))
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

exports.updateCommentVote = (req, res, next) => {
  const { article_id, comment_id } = req.params;
  const { inc_votes } = req.body;
  if (typeof inc_votes === 'string') return next({ code: '22P02' });
  return connection('comments')
    .select('*')
    .where('article_id', article_id)
    .where('comment_id', comment_id)
    .modify((comQuery) => {
      if (inc_votes > 0) comQuery.increment('votes', inc_votes);
      else comQuery.decrement('votes', Math.abs(inc_votes));
    })
    .returning('*')
    .then((comment) => {
      if (comment.length === 0) return Promise.reject({ status: 404, message: 'Page not found' });
      return res.status(200).send({ comment });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { article_id, comment_id } = req.params;
  return connection('comments')
    .select('*')
    .where('article_id', article_id)
    .where('comment_id', comment_id)
    .del()
    .returning('*')
    .then((comment) => {
      if (comment.length === 0) return Promise.reject({ status: 404, message: 'Page not found' });
      return res.status(204).send({});
    })
    .catch(next);
};
