const connection = require('../db/connection');

exports.getUsers = (req, res, next) => connection('users')
  .select('*')
  .modify((userQuery) => {
    if (req.params.username) userQuery.where('username', req.params.username);
  })
  .then((users) => {
    if (users.length === 0) {
      return next({ status: 404, message: 'Page not found' });
    }
    if (users.length === 1) [users] = users;
    return res.status(200).send({ users });
  })
  .catch(next);
