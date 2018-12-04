const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const router = require('./routes/api');
const { handle404, handle422 } = require('./errors/index');


app.use(bodyParser.json());

app.use('/api', router);

app.use('/*', (req, res, next) => {
  next({ status: 404, message: 'Page not found' });
});

app.use(handle404);
app.use(handle422);

module.exports = app;
