const router = require('express').Router();
const { getAllUsers, getSingleUser } = require('../controllers/users');
const { handle405 } = require('../errors/index');

// router.param('user_id', (req, res, next, username) => {
//   if (Number.isInteger(+user_id)) next();
//   else next({ code: '22P02' });
// });

router
  .route('/')
  .get(getAllUsers)
  .all(handle405);

router
  .route('/:username')
  .get(getSingleUser)
  .all(handle405);

module.exports = router;
