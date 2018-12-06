const router = require('express').Router();
const { getAllUsers, getSingleUser } = require('../controllers/users');
const { handle405 } = require('../errors/index');

router
  .route('/')
  .get(getAllUsers)
  .all(handle405);

router
  .route('/:user_id')
  .get(getSingleUser)
  .all(handle405);

module.exports = router;
