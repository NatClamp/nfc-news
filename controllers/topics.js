const connection = require('../db/connection');

exports.getAllTopics = (req, res, next) => {
  connection('topics')
    .select('*')
    .then(topics => res.status(200).send({ topics }))
    .catch(next);
};

exports.addATopic = (req, res, next) => {
  if (!req.body.slug || !req.body.description) return next({ status: 400, code: 23502, message: 'missing value violates not-null constraint' });
  return connection('topics')
    .insert(req.body)
    .returning('*')
    .then(topic => res.status(201).send({ topic }))
    .catch(next);
};
