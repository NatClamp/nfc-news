const router = require('express').Router();
const { getAllTopics, addATopic, getArticlesWithTopic } = require('../controllers/topics');

router.route('/')
  .get(getAllTopics)
  .post(addATopic);

router.route('/:topic/articles')
  .get(getArticlesWithTopic);

module.exports = router;
