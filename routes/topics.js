const router = require('express').Router();
const { getAllTopics, addATopic } = require('../controllers/topics');
const { addArticlesWithTopic, getArticlesController } = require('../controllers/articles');
const { handle405 } = require('../errors/index');

router
  .route('/')
  .get(getAllTopics)
  .post(addATopic)
  .all(handle405);

router
  .route('/:topic/articles')
  .get(getArticlesController)
  .post(addArticlesWithTopic)
  .all(handle405);

module.exports = router;
