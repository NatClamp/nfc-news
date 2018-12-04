const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const router = require('./routes/api');
const { handle404 } = require('./errors/index');


app.use(bodyParser.json());

app.use('/api', router);

app.use('/*', (req, res, next) => {
  handle404();
});

// app.use(handle404);

module.exports = app;
