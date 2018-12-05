const router = require('express').Router();
const { handle405 } = require('../errors/index');
const { getAllArticles, getArticleByArticleId } = require('../controllers/articles');

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
  .get(getArticleByArticleId);

module.exports = router;
