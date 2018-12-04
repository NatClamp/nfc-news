const router = require('express').Router();
const { getAllTopics, addATopic, getArticlesWithTopic } = require('../controllers/api');

router.route('/')
  .get(getAllTopics)
  .post(addATopic);

router.route('/:topic/articles')
  .get(getArticlesWithTopic);

module.exports = router;
