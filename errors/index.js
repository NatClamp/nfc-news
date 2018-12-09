/* eslint "no-console":0 */

exports.handle404 = (err, req, res, next) => {
  // console.log(err);
  if (err.status === 404) res.status(404).send({ message: err.message });
  else if (err.code === '23503' && err.constraint === 'articles_topic_foreign') res.status(404).send({ message: 'Topic does not exist' });
  else if (err.constraint === 'comments_article_id_foreign') res.status(404).send({ message: 'Page not found' });
  else next(err);
};

exports.handle422 = (err, req, res, next) => {
  const codes = {
    23503: 'violates foreign key constraint',
    23505: 'This key already exists',
  };
  if (codes[err.code]) res.status(422).send({ message: codes[err.code] });
  else next(err);
};

exports.handle400 = (err, req, res, next) => {
  const codes = {
    42703: 'Invalid format',
    23502: 'missing value violates not-null constraint',
    '22P02': 'invalid input syntax for integer',
  };
  if (codes[err.code]) res.status(400).send({ message: codes[err.code] });
  else next(err);
};

exports.handle500 = (err, req, res, next) => {
  const codes = {
    '2201X': 'OFFSET must not be negative',
  };
  if (codes[err.code]) res.status(500).send({ message: codes[err.code] });
};

exports.handle405 = (req, res, next) => {
  res.status(405).send({ message: 'METHOD NOT ALLOWED' });
};
