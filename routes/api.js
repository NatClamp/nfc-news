const router = require('express').Router();
const topicsRouter = require('./topics');
const articlesRouter = require('./articles');
const usersRouter = require('./users');
const { getEndpointJSON } = require('../controllers/api');

router
  .route('/')
  .get(getEndpointJSON);

router.use('/topics', topicsRouter);
router.use('/articles', articlesRouter);
router.use('/users', usersRouter);

module.exports = router;
