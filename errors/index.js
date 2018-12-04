exports.handle404 = (err, req, res, next) => {
  console.log(err);
  if (err.status === 404) res.status(404).send({ message: err.message });
  else next(err);
};
