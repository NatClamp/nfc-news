/* eslint "no-console":0 */

exports.handle404 = (err, req, res, next) => {
  // console.log(err);
  if (err.status === 404) res.status(404).send({ message: err.message });
  else next(err);
};

exports.handle422 = (err, req, res, next) => {
  if (err.code === '23505') res.status(422).send({ message: 'This key already exists' });
  else next(err);
};
