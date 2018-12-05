const router = require('express').Router();
const { getAllTopics, addATopic, getArticlesWithTopic } = require('../controllers/topics');
const { handle405 } = require('../errors/index');

router
  .route('/')
  .get(getAllTopics)
  .post(addATopic)
  .all(handle405);

router
  .route('/:topic/articles')
  .get(getArticlesWithTopic)
  .all(handle405);

module.exports = router;
