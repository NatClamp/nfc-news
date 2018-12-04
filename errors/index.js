exports.handle404 = (err, req, res, next) => {
  if (err.code === 0) res.status(404).send({ message: 'Path does not exist' });
};
