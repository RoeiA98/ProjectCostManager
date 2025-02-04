#!/usr/bin/env node
require('dotenv').config({ path: './config.env' });
const express = require('express');
const mongoose = require('mongoose');
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const debug = require('debug')('expressjs:server'); // currying function
const http = require('http');

const apiRouter = require('./routes/api');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // If you're using an API, return JSON instead of rendering a view
  if (req.xhr || req.accepts('json')) {
    res.status(err.status || 500).json({
      message: err.message,
      error: err
    });
  } else {
    // fallback to rendering the error page
    res.status(err.status || 500);
    res.render('error');
  }
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || 3000;
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

// MongoDB connection
DB_URI = process.env.DB_URI;

if (!DB_URI) {
  console.error("MongoDB URI is not defined. Please check your environment variables.");
  process.exit(1); // Exit if DB URI is not set
}

// Connecting to DataBase
mongoose
    .connect(DB_URI)
    .then(() => console.log("MongoDB connected successfully."))
    .catch((err) => {
      console.error("MongoDB connection error:", err);
      process.exit(1); // Exit the application if DB connection fails
    });

/**
 * Listen on provided port, on all network interfaces.
 */

// Create the HTTP server and listen on the provided port
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
server.on('error', onError);
server.on('listening', onListening);

/**
 * Event listener for HTTP server "error" event.
 * @param {Error} error - Error object.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

module.exports = app;