/**
 * Express application
 */

const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const stackRouter = require('./routes/stack');
const ttlStoreRouter = require('./routes/ttl-store');

const app = express();

// init utilities
app.use(logger('dev'));
// TODO: Restrict/verify headers type (application/JSON)?
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// init routes
app.use('/', indexRouter);
app.use('/stack', stackRouter);
app.use('/ttl-store', ttlStoreRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send(err);
});
module.exports = app;
