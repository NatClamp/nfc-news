const router = require('express').Router();
const { getAllUsers, getSingleUser } = require('../controllers/users');
const { handle405 } = require('../errors/index');

router.param('username', (req, res, next, username) => {
  if (Number.isInteger(+username)) next({ code: '22P02' });
  else next();
});

router
  .route('/')
  .get(getAllUsers)
  .all(handle405);

router
  .route('/:username')
  .get(getSingleUser)
  .all(handle405);

module.exports = router;
