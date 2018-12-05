const router = require('express').Router();
const { handle405 } = require('../errors/index');
const { getAllArticles } = require('../controllers/articles');

router
  .route('/')
  .get(getAllArticles)
  .all(handle405);

module.exports = router;
