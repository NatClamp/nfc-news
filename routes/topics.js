const router = require('express').Router();
const { getAllTopics, addATopic } = require('../controllers/topics');
const { getArticlesWithTopic, addArticlesWithTopic } = require('../controllers/articles');
const { handle405 } = require('../errors/index');

router
  .route('/')
  .get(getAllTopics)
  .post(addATopic)
  .all(handle405);

router
  .route('/:topic/articles')
  .get(getArticlesWithTopic)
  .post(addArticlesWithTopic)
  .all(handle405);

module.exports = router;
