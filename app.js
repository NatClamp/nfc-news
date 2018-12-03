const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const router = require('./routes/api');

app.use(bodyParser.json());

app.use('/api', router);

app.all('/*', (req, res, next) => {
  res.status(404).send({ msg: 'Sorry, path does not exist' });
});

app.use((err, req, res, next) => {
  if (err.code === 0) res.status(404).send({ msg: 'Sorry, path does not exist' });
  else res.status(500).send({ err });
});

module.exports = app;
