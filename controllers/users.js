const connection = require('../db/connection');

exports.getAllUsers = (req, res, next) => connection('users')
  .select('*')
  .then((users) => {
    res.status(200).send({ users });
  })
  .catch(next);

exports.getSingleUser = (req, res, next) => {
  const { user_id } = req.params;
  return connection('users')
    .select('*')
    .where('user_id', user_id)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};
