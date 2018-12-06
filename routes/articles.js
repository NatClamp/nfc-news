const router = require('express').Router();
const { handle405 } = require('../errors/index');
const {
  getAllArticles, getArticleByArticleId, updateArticleVote, deleteArticle,
} = require('../controllers/articles');
const {
  getAllComments, addComment, updateCommentVote, deleteComment,
} = require('../controllers/comments');

router.param('article_id', (req, res, next, article_id) => {
  if (Number.isInteger(+article_id)) next();
  else next({ code: '22P02' });
});

router.param('comment_id', (req, res, next, comment_id) => {
  if (Number.isInteger(+comment_id)) next();
  else next({ code: '22P02' });
});

router
  .route('/')
  .get(getAllArticles)
  .all(handle405);

router
  .route('/:article_id')
  .get(getArticleByArticleId)
  .patch(updateArticleVote)
  .delete(deleteArticle)
  .all(handle405);

router
  .route('/:article_id/comments')
  .get(getAllComments)
  .post(addComment)
  .all(handle405);

router
  .route('/:article_id/comments/:comment_id')
  .patch(updateCommentVote)
  .delete(deleteComment);

module.exports = router;
