const router = require('express').Router();
const { getAllTopics, addATopic } = require('../controllers/api');

router.route('/')
  .get(getAllTopics)
  .post(addATopic);

module.exports = router;
