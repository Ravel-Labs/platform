var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var cors = require("cors");
var config = require('./config')

// API router handlers
var analyticsRouter = require('./routes/analytics');
var authRouter = require('./routes/auth');
var feedbackRouter = require('./routes/feedback');
var indexRouter = require('./routes/index');
var testRouter = require('./routes/test');
var tracksRouter = require('./routes/tracks');
var usersRouter = require('./routes/users');
var statsRouter = require('./routes/stats');

// Middleware
var tokenMiddleware = require('./middleware/token')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors(
  {
    origin: [
      config.frontendUrl,
      'http://localhost:3000',
    ],
    credentials: true
  }
));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/', indexRouter);
app.use("/analytics", tokenMiddleware.withUser, analyticsRouter);
app.use("/auth", authRouter);
app.use("/feedback", tokenMiddleware.withUser, feedbackRouter);
app.use("/test", tokenMiddleware.withUser, testRouter);
app.use("/tracks", tokenMiddleware.withUser, tracksRouter);
app.use("/users", usersRouter);
app.use("/stats", tokenMiddleware.requireUser, usersRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
