const router = require('express').Router();
const { handle405 } = require('../errors/index');
const {
  getAllArticles, getArticleByArticleId, updateVote, deleteArticle,
} = require('../controllers/articles');
const { getAllComments, addComment } = require('../controllers/comments');

router.param('article_id', (req, res, next, article_id) => {
  if (Number.isInteger(+article_id)) next();
  else next({ code: '22P02' });
});

router
  .route('/')
  .get(getAllArticles)
  .all(handle405);

router
  .route('/:article_id')
  .get(getArticleByArticleId)
  .patch(updateVote)
  .delete(deleteArticle);

router
  .route('/:article_id/comments')
  .get(getAllComments)
  .post(addComment);

module.exports = router;
