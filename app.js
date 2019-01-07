const express = require('express');
const cors = require('cors');

const app = express();
const bodyParser = require('body-parser');
const router = require('./routes/api');
const {
  handle404,
  handle422,
  handle400,
  handle500,
} = require('./errors/index');

app.use(bodyParser.json());

app.use(cors());

app.use('/api', router);

app.use('/*', (req, res, next) => {
  next({ status: 404, message: 'Page not found' });
});

app.use(handle400);
app.use(handle404);
app.use(handle422);
app.use(handle500);

module.exports = app;
