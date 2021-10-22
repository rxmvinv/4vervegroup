'use strict'

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const routesApi = require('./api/routes/index');
const app = express();
app.use(express.json())

app.use(morgan('combined'));

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(cors());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/api', routesApi);

app.use(function(err, req, res, next) {
  console.log('payload: ', req.payload, 'body: ', req.body);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = err;//req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({error: {status: err.status, message: err.message}});
});

let port = process.env.PORT || 3001;

app.listen(port, () => console.log(`api running on port ${port}`));

module.exports = app;
